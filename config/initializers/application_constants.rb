DOMAIN_NAMES = {"development" => "http://localhost:3000", "production" =>  "http://www.www.livestockevent.co.uk"}
DOMAIN_NAME = DOMAIN_NAMES[Rails.env]

STRIPE_SECRET_KEYS = {"development" => "sk_test_mV9OU1tEbJS4ZxLDEpk7C0w0", "production" =>  "sk_live_XcgPvgC7eBdMfdumzR3LCGf2"}
STRIPE_PUBLISHABLE_KEYS = {"development" => "pk_test_OrSntymwWAeHpIIRtzwEDOqo", "production" =>  "pk_live_9raKOYvWtj9vUQaJcDqZ4L7J"}

STRIPE_SECRET_KEY = STRIPE_SECRET_KEYS[Rails.env]
STRIPE_PUBLISHABLE_KEY = STRIPE_PUBLISHABLE_KEYS[Rails.env]