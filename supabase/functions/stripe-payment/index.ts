/**
 * Stripe Payment — Supabase Edge Function
 * Handles payment intent creation and webhook verification server-side.
 * Frontend only receives clientSecret for Stripe Elements confirmation.
 *
 * Endpoints:
 *   POST /stripe-payment  { action: 'create-intent', amount, currency, metadata }
 *   POST /stripe-payment  { action: 'verify-webhook', ... }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('stripe-payment');

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://dental-clinic-anq.pages.dev';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');

// Minimal Stripe API client (no SDK needed in Deno)
async function stripeRequest(endpoint: string, body: Record<string, string>) {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }

  const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Stripe API error');
  }
  return data;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { action, amount, currency, metadata, appointmentRef } = await req.json();

    if (action === 'create-intent') {
      // Validate required fields
      if (!amount || typeof amount !== 'number' || amount < 100) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount (minimum 100 = 1.00 BDT)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Authenticate user (optional — guest checkout allowed)
      let userId = null;
      let userEmail = null;
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        const supabaseUser = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: { user } } = await supabaseUser.auth.getUser();
        if (user) {
          userId = user.id;
          userEmail = user.email;
        }
      }

      // Create payment intent server-side (amount in smallest currency unit)
      const intentParams: Record<string, string> = {
        'amount': String(Math.round(amount)),
        'currency': currency || 'bdt',
        'automatic_payment_methods[enabled]': 'true',
      };

      // Attach metadata (NO PHI — only reference numbers)
      if (appointmentRef) {
        intentParams['metadata[appointment_ref]'] = appointmentRef;
      }
      if (userId) {
        intentParams['metadata[user_id]'] = userId;
      }
      if (metadata?.service) {
        intentParams['metadata[service]'] = metadata.service;
      }

      const paymentIntent = await stripeRequest('/payment_intents', intentParams);

      // Audit log the payment attempt (no card details — only intent ID)
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await supabaseAdmin.from('audit_logs').insert({
        user_id: userId,
        user_email: userEmail || 'guest',
        user_role: userId ? 'patient' : 'anon',
        action: 'PAYMENT_INTENT',
        table_name: 'payments',
        details: `Payment intent created: ${paymentIntent.id}, amount: ${amount} ${currency || 'bdt'}, ref: ${appointmentRef || 'none'}`,
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      }).catch(() => {}); // Non-blocking audit

      // Return ONLY clientSecret — frontend uses this with Stripe Elements
      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify-webhook') {
      // Webhook verification is handled by checking Stripe signature
      // This endpoint is called by Stripe servers, not the frontend
      const signature = req.headers.get('stripe-signature');
      if (!signature || !STRIPE_WEBHOOK_SECRET) {
        return new Response(
          JSON.stringify({ error: 'Missing webhook signature' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // For full webhook verification, use Stripe's signature verification
      // This is a placeholder — production should verify the signature cryptographically
      const body = await req.text();

      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );

      await supabaseAdmin.from('audit_logs').insert({
        action: 'PAYMENT_WEBHOOK',
        table_name: 'payments',
        details: `Stripe webhook received`,
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      }).catch(() => {});

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('stripe-payment error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'Payment processing failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
