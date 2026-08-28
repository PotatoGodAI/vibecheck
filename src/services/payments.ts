export interface CheckoutProvider {
  available: boolean;
  checkout(plan: 'pro'): Promise<void>;
}
export const payMongoProvider: CheckoutProvider = {
  available: import.meta.env.VITE_PAYMENTS_ENABLED === 'true',
  async checkout() {
    throw new Error('Checkout requires the PayMongo server integration. No payment was made.');
  },
};
