Rails.configuration.stripe = {
  :publishable_key => 'pk_test_OrSntymwWAeHpIIRtzwEDOqo',
  :secret_key      => 'sk_test_mV9OU1tEbJS4ZxLDEpk7C0w0'
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]