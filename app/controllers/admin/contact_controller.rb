module Admin
  class ContactController < ApplicationController
   layout "admin"
    def new
      @message = Message.new
    end
   
    def create
      @message = Message.new(params[:message])
      respond_to do |format|
        if @message.valid?
          ContactMailer.new_message(@message).deliver
          format.json { render json: @message, status: :created }
        else
          format.json { render json: @message.errors, status: :unprocessable_entity }
        end
      end
    end
  end
end