class Order < ActiveRecord::Base
	resourcify
	belongs_to :booking, inverse_of: :orders
	def user=(param)
		return User.find(param)
	end

	def user
	end
	# SagePay constants
	def vendor
		'dairyevent123ls'
	end
	def vendortxcode #must be unique
		"#{vendor}#{id}"
	end
	#sagepay settings - encrypt and encode string for crypt transport 
	def encryptandencode(string)
		cipher = OpenSSL::Cipher.new 'aes-128-cbc'
		cipher.encrypt
		cipher.key = 'QE48jsete3QGDGva' #should be super secret key from sagepay
		cipher.iv = cipher.random_iv

		encrypted = cipher.update string
		encrypted << cipher.final

		encoded = Base64.encode64(encrypted).encode('utf-8')
		return encoded
	end

	def wrappedencryptandencode(string)
		salt = Time.now.to_i.to_s
		sha256 = Digest::SHA2.new(256)
		secret_key = sha256.digest("QE48jsete3QGDGva")
		iv = OpenSSL::Cipher.new('aes-128-cbc').random_iv
		encrypted_value = Encryptor.encrypt(string, :key => secret_key, :iv => iv, :salt => salt)
		
		encoded = Base64.encode64(encrypted_value).encode('utf-8')
		return encoded
	end
	def currency
		'GBP'
	end
	def description
		'Livestock Event 2014 Stand Booking'
	end
	def successurl
		'http://livestockevent.herokuapp.com/payment-success'
	end
	def failureurl
		'http://livestockevent.herokuapp.com/payment-incomplete'
	end
	def crypt
		unencrypted = "VendorTxCode=#{vendortxcode}&Amount=#{amount}&Currency=#{currency}&Description=#{description}&SuccessURL=#{successurl}&FailureUrl=#{failureurl}&BillingSurname=#{billing_surname}&BillingFirstNames=#{billing_firstnames}&BillingAddress1=#{billing_address}&BillingCity=#{billing_city}&BillingPostcode=#{billing_postcode}&BillingCountry=#{billing_country}&DeliverySurname=#{delivery_surname}&DeliveryFirstNames=#{delivery_firstnames}&DeliveryAddress1=#{delivery_address}&DeliveryCity=#{delivery_city}&DeliveryPostcode=#{delivery_postcode}&DeliveryCountry=#{delivery_country}"
		puts unencrypted #logged to the server console
		encoded = wrappedencryptandencode(unencrypted)
		return encoded
	end
end
