/**
 * Stripe Payment Client
 * Frontend only holds the publishable key for Stripe Elements.
 * All payment logic (intent creation, amount calculation) is server-side.
 */

import { supabase, isSupabaseConfigured } from './supabase';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const isStripeConfigured = Boolean(STRIPE_PK) && !STRIPE_PK.includes('pk_test_placeholder');

/**
 * Create a payment intent via the backend Edge Function.
 * Returns { clientSecret, paymentIntentId } for Stripe Elements.
 *
 * @param {number} amount - Amount in smallest currency unit (e.g., 50000 = 500.00 BDT)
 * @param {string} appointmentRef - Reference number for the appointment
 * @param {object} metadata - Additional metadata (service name, etc.)
 */
export async function createPaymentIntent(amount, appointmentRef, metadata = {}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Backend not configured. Payment cannot be processed.');
  }

  const { data, error } = await supabase.functions.invoke('stripe-payment', {
    body: {
      action: 'create-intent',
      amount,
      currency: 'bdt',
      appointmentRef,
      metadata,
    },
  });

  if (error) throw new Error('Payment service unavailable. Please try again.');
  if (!data?.clientSecret) throw new Error('Payment initialization failed.');

  return {
    clientSecret: data.clientSecret,
    paymentIntentId: data.paymentIntentId,
  };
}

/**
 * Get the Stripe publishable key for initializing Stripe Elements.
 * Returns null if Stripe is not configured.
 */
export function getStripePublishableKey() {
  return isStripeConfigured ? STRIPE_PK : null;
}
