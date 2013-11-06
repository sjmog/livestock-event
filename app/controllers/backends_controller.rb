class BackendsController < ApplicationController
  include ActiveMerchant::Billing::Integrations
  protect_from_forgery :except=>[:sagepay_return]

  #in routes => match '/payment-backend'=>'backends#sagepay_return'
  def sagepay_return
    notification = SagePay::Notification.new(request.raw_post)  

    order = Order.find(notification.item_id)

    if notification.acknowledge
      begin
        if notification.complete?
          order.status = 'success'
        end
      rescue
        order.status = "failed"
        raise
      ensure
        order.save
      end
    end
  render :text =>"Order status for #{order.id} is #{order.status}" 

  end

end