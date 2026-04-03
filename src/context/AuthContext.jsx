import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

// HIPAA 164.312(a)(2)(iii) — automatic logoff after inactivity
const INACTIVITY_WARNING_MS = 14 * 60 * 1000; // 14 min → show warning
const INACTIVITY_LOGOUT_MS = 15 * 60 * 1000;  // 15 min → force logout
const SESSION_CHANNEL = 'eds-session-sync';    // BroadcastChannel for tab-aware timeout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const warningTimer = useRef(null);
  const logoutTimer = useRef(null);
  const broadcastChannel = useRef(null);

  // Fetch user profile (role, name, etc.)
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Failed to fetch profile:', error.message);
      return null;
    }
    return data;
  }, []);

  // Reset inactivity timers on user activity
  // HIPAA-SESSION-001: BroadcastChannel syncs activity across tabs
  const resetInactivityTimers = useCallback(() => {
    if (!user) return;
    setShowTimeoutWarning(false);

    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    warningTimer.current = setTimeout(() => {
      setShowTimeoutWarning(true);
    }, INACTIVITY_WARNING_MS);

    logoutTimer.current = setTimeout(() => {
      signOut();
    }, INACTIVITY_LOGOUT_MS);
  }, [user]);

  // Broadcast activity to other tabs so one active tab keeps all alive
  const broadcastActivity = useCallback(() => {
    try {
      broadcastChannel.current?.postMessage({ type: 'activity', timestamp: Date.now() });
    } catch { /* channel may be closed */ }
  }, []);

  // Track user activity for auto-logout + BroadcastChannel tab sync
  useEffect(() => {
    if (!user) return;

    // Set up BroadcastChannel for tab-aware session management
    try {
      broadcastChannel.current = new BroadcastChannel(SESSION_CHANNEL);
      broadcastChannel.current.onmessage = (event) => {
        if (event.data?.type === 'activity') {
          resetInactivityTimers();
        } else if (event.data?.type === 'logout') {
          setUser(null);
          setProfile(null);
          setShowTimeoutWarning(false);
        }
      };
    } catch { /* BroadcastChannel not supported — single-tab fallback */ }

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handler = () => {
      resetInactivityTimers();
      broadcastActivity();
    };

    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    resetInactivityTimers(); // Start timers

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      try { broadcastChannel.current?.close(); } catch { /* ignore */ }
    };
  }, [user, resetInactivityTimers, broadcastActivity]);

  // Auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id);
          setProfile(p);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  // Auth methods
  const signUp = async (email, password, metadata = {}) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signInWithOtp = async (phone) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
    return data;
  };

  const verifyOtp = async (phone, token) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    setShowTimeoutWarning(false);
    // Broadcast logout to all tabs
    try { broadcastChannel.current?.postMessage({ type: 'logout' }); } catch { /* ignore */ }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const hasRole = (role) => profile?.role === role;
  const isStaff = () => ['admin', 'doctor', 'receptionist'].includes(profile?.role);
  const isAdmin = () => profile?.role === 'admin';

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    showTimeoutWarning,
    setShowTimeoutWarning,
    signUp,
    signIn,
    signInWithOtp,
    verifyOtp,
    signOut,
    resetPassword,
    updatePassword,
    hasRole,
    isStaff,
    isAdmin,
    resetInactivityTimers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
