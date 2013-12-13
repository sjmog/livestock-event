desc "This task uses Nokogiri to fetch tweets and commit to the database"
task fetch_tweets: :environment do
	ruby "lib/tasks/fetch_tweets.rb"
end