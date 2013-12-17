#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

EmberAuthRailsDemo::Application.load_tasks

namespace :scraping do
	desc "Fetches all tweets and commits to DB"
	task fetch_tweets: :environment do
		require 'rubygems'
		require 'nokogiri'
		require 'open-uri'


		url = "https://twitter.com/LivestockEvent"
		#clear all existing data
		SocialT.delete_all
		doc = Nokogiri::HTML(open(url))

		puts 'Pulling data from ' + doc.at_css("title").text
		doc.css(".stream-item").each do |item|
			uid = item[':data-item-id']
			user = item.at_css(".username").text
			text = item.at_css(".tweet-text").content
			published = item.at_css("._timestamp")[':data-time']
		  	puts "Tweet #{uid} by #{user}: #{text} (#{published})"
		  	@tweet = SocialT.create(:uid => uid, :link => url, :user => user, :text => text, :published => published)
		  	#save the tweet only if it doesn't already exist
		  	if SocialT.find_by_uid(uid)
		  		puts 'skipping extant item'
		  	else
		  		@tweet.save
		  	end
		end
	end

	desc "Fetches all Facebook posts and commits to DB"
	task fetch_posts: :environment do
		require 'rubygems'
		require 'koala'
		require 'json'

		url = "https://www.facebook.com/LivestockEvent"
		#clear all existing data
		SocialF.delete_all
		@oauth = Koala::Facebook::OAuth.new('170121459849102', '72a941b9578066ba2c54b74435b02bb4')
		@graph = Koala::Facebook::API.new(@oauth.get_app_access_token)
		feed = @graph.get_connections("livestockevent", "feed")
		feed.each do |post|
			uid = post["id"]
			user = post["from"]["name"]
			text = post["message"]
			subtext = post["description"]
			likes = post["likes"].nil? ? 0 : post["likes"]["data"].size
			published = post["created_time"]
			link = post["link"]

			puts "Post #{uid} by #{user}: #{text} - #{subtext} (#{published}, #{likes} Likes)"
			if text.nil?
				puts 'no text, moving on...'
			else
				@post = SocialF.create(:uid => uid, :link => link, :likes => likes, :user => user, :text => text, :published => published)
		  		#save the post only if it doesn't already exist
		  		if SocialF.find_by_uid(uid)
		  			puts 'skipping extant item'
		  		else
		  			@post.save
		  		end
			end
		end
	end


	desc "Fetches all LinkedIn posts and commits to DB"
	task fetch_linkedin: :environment do
		require 'rubygems'
		require 'nokogiri'
		require 'open-uri'


		url = "http://www.linkedin.com/groups/Livestock-Event-4723767"
		base_url = "http://www.linkedin.com"
		#clear all existing data
		SocialL.delete_all
		doc = Nokogiri::HTML(open(url))

		puts 'Pulling data from ' + doc.at_css("title").text
		doc.css(".discussion-item").each do |item|
			uid = item['data-li-item_id']
			if item.at_css(".poster-name > a").nil?
				user = nil
			else
				user = item.at_css(".poster-name > a").text.strip
			end
			
			if item.at_css(".user-contributed > h3 > a").nil?
				text = nil
				link = url
			else
				text = item.at_css(".user-contributed > h3 > a").text
				link = base_url + item.at_css(".user-contributed > h3 > a")['href']
			end
			published = item.at_css(".timestamp").text.strip
			
		  	puts "LinkedIn post #{uid} by #{user}: #{text} (#{published}), link: #{link}"
		  	@linkedInPost = SocialL.create(:uid => uid, :link => url, :user => user, :text => text, :published => published)
		  	#save the tweet only if it doesn't already exist
		  	if SocialL.find_by_uid(uid)
		  		puts 'skipping extant item'
		  	else
		  		@linkedInPost.save
		  	end
		end
	end
end