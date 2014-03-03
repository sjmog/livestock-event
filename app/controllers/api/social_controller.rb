module Api
  class SocialController < BaseController
    def social_ts
      # Register the info via OAuth (this needs to be moved to a config file)
      client = Twitter::REST::Client.new do |config|
        config.consumer_key = 'V60kYPb1Nn1zI0OD7EL7mw'
        config.consumer_secret = 'i8pZhPHSjUYyp775s2P1SY04Fof6hSJCH0z8OtUc'
        config.access_token = '391482739-nNsTF25FIgBl8u9NAfF9HCvRAy4Vzb4T2XxWTdQK'
        config.access_token_secret = '0l3TdjLzRnk8HwGBOCB5yhRcC0AKJYW1o5WuKnQEjZNQf'
      end
      # Create an empty holder for the tweets
      @social_ts = []
      # Fetch the timeline using the authentication data above
      @tweets = client.user_timeline("livestockevent")
      @tweets.each do |tweet|

        unless SocialT.find_by_text(tweet.text)
          # If the tweet doesn't exist in the database, create it and commit to the DB
          t = SocialT.create(
            :user => tweet.user.name,
            :text => tweet.text,
            :published => tweet.created_at,
            :link => tweet.url.to_s
            )
          # The push the tweet object to the tweets holder, saving a DB call
          @social_ts.push(t)
        else
          # If the tweet already exists in the database, load it from there
          @social_ts.push(SocialT.find_by_text(tweet.text))
        end
      end
      # Render the collection of new and old tweets
      render json: @social_ts, status: 201, root: "social_ts"
    end
    def social_fs
      @oauth = Koala::Facebook::OAuth.new("170121459849102", "72a941b9578066ba2c54b74435b02bb4")
      @graph = Koala::Facebook::API.new(@oauth.get_app_access_token)
      @social_fs = []
      # Fetch the wall using the authentication data above
      @posts = @graph.get_object("livestockevent/feed")
      @posts.each do |post|

        unless SocialF.find_by_text(post["message"])
          # If the post doesn't exist in the database, create it and commit to the DB
          p = SocialF.create(
            :user => post["from"]["name"],
            :text => post["message"],
            :published => post["created_time"].to_s,
            :link => post["link"]
            )
          # # The push the post object to the posts holder, saving a DB call
          @social_fs.push(p)
        else
          # If the post already exists in the database, load it from there
          @social_fs.push(SocialF.find_by_text(post["message"]))
        end
      end
      # Render the collection of new and old posts
      render json: @social_fs, status: 201, root: "social_fs"
    end
    def social_ls
      # Uses Kimonolabs custom API
      response = RestClient.get 'http://www.kimonolabs.com/api/3ylk7ta6?apikey=7cb5f661eef740c6289337b2b590d879'
      response = JSON[response]
      @posts = response["results"]["posts"]

      @social_ls = []
      # Iterate over the posts
      @posts.each do |post|

        unless SocialL.find_by_text(post["text"]["text"])
          # If the post doesn't exist in the database, create it and commit to the DB
          #Check to see it's got content, first
          if post["text"]["text"] != "" && post["date"].to_s != ""
            p = SocialL.create(
              :user => post["name"]["text"],
              :text => post["text"]["text"],
              :published => Chronic.parse(post["date"].to_s),
              :link => post["name"]["href"]
              )
          end
          # # The push the post object to the posts holder, saving a DB call
          @social_ls.push(p)
        else
          # If the post already exists in the database, load it from there
          @social_ls.push(SocialL.find_by_text(post["text"]["text"]))
        end
      end
      # Render the collection of new and old tweets
      render json: @social_ls, status: 201, root: "social_ls"
    end

  end
end