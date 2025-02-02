import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SK ?? "", {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: "Arigo",
    version: "0.0.1",
  },
});
