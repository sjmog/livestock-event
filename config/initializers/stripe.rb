Rails.configuration.stripe = {
  :publishable_key => STRIPE_PUBLISHABLE_KEY,
  :secret_key      => STRIPE_SECRET_KEY
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]