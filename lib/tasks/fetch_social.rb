require "rubygems"
require "rails"
#twitter
require 'twitter'

@client = Twitter::REST::Client.new do |config|
  config.consumer_key    = "eSEcTALTZZf2v8tmN6K7IQ"
  config.consumer_secret = "L9HZq7x5yH7lqO7znoMir86b18bBrEaduwbGumjt5U0"
end

def collect_with_max_id(collection=[], max_id=nil, &block)
  response = yield max_id
  collection += response
  response.empty? ? collection.flatten : collect_with_max_id(collection, response.last.id - 1, &block)
end

def fetch_all_tweets(user)
  collect_with_max_id do |max_id|
    options = {:count => 30, :include_rts => true}
    options[:max_id] = max_id unless max_id.nil?
    @client.user_timeline(user, options)
  end
end

@tweets = fetch_all_tweets("LivestockEvent")
@tweets.each do |tweet|
	social_t = SocialT.create(:user => tweet.user.screen_name, :text => tweet.text, :published => tweet.created_at)
	unless SocialT.find_by_text(tweet.text)
		social_t.save
	end
end
