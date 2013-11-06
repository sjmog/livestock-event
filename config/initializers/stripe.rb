Rails.configuration.stripe = {
  :publishable_key => 'pk_live_9raKOYvWtj9vUQaJcDqZ4L7J',
  :secret_key      => 'sk_live_XcgPvgC7eBdMfdumzR3LCGf2'
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]