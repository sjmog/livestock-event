module Admin
  class OrdersController < BaseController
    layout "admin"
    load_and_authorize_resource

    def index
      @orders = Order.all
    end

    def new
      @order = Order.new
    end

    def show
      @order = Order.find(params[:id])
    end

    def edit
      @order = Order.find(params[:id])
    end

    def update
      @order = Order.find(params[:id])
     
      if @order.update(params[:order])
        redirect_to admin_order_path(@order)
      else
        render 'edit'
      end
    end

    def create
      @order = Order.create(order_params)
      if @order.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.order_email(@order.user).deliver
        redirect_to admin_order_path(@order)
      else
        render "new"
      end
    end


    def destroy
      @order = Order.find(params[:id])
      @order.destroy
      flash[:notice] = "Payment deleted."
      @orders = Order.all
    end


    protected

      def permitted_params
        params.permit(:order => [:status, :amount, :date, :user_id, :booking_id, :billing_surname, :billing_firstnames, :billing_address, :billing_city, :billing_postcode, :billing_country, :delivery_surname, :delivery_firstnames, :delivery_address, :delivery_city, :delivery_postcode, :delivery_country, :crypt])
      end

    private

    # Strong Parameters (Rails 4)
    def order_params
      params.require(:order).permit(:status, :amount, :date, :user_id, :booking_id, :billing_surname, :billing_firstnames, :billing_address, :billing_city, :billing_postcode, :billing_country, :delivery_surname, :delivery_firstnames, :delivery_address, :delivery_city, :delivery_postcode, :delivery_country, :crypt)
    end
  end
end