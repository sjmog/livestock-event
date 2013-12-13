require 'rubygems'
require 'nokogiri'
require 'open-uri'


url = "https://twitter.com/LivestockEvent"
doc = Nokogiri::HTML(open(url))
puts 'Pulling data from ' + doc.at_css("title").text
doc.css(".stream-item").each do |item|
	uid = item[':data-item-id']
	user = item.at_css(".username").text
	text = item.at_css(".tweet-text").content
	published = item.at_css("._timestamp")[':data-time']
  	puts "Tweet #{uid} by #{user}: #{text} (#{published})"
  	@tweet = SocialT.create(:user => user, :text => text, :published => published)
  	@tweet.save
end