

// inherit from edit controller
App.OrdersNewController = Ember.Controller.extend({
	needs: ['application'],
	init: function() {
		this._super();
		var self = this;
		Ember.run.later(function() {
			var user = App.AuthManager.get('apiKey.user');
			console.log(user);
			self.set('content.user', user);
			userBookings = user.get('bookings');
			console.log(userBookings);
			firstBooking = userBookings.objectAt(0);
			console.log(firstBooking);
			self.set('bookings', userBookings);
			self.set('content.status', 'pending payment');
			self.set('content.booking', firstBooking);
			self.set('content.amount', firstBooking.get('deposit'));
		}, 2000);
	},
	setup:function() {
		console.log('controller setup');
		var self = this;
		
	},
	bookings: null,
	selectedBooking: null,
	actions: {
		save: function(order) {
		  var d = new Date();
		     var curr_date = d.getDate();
		     var curr_month = d.getMonth() + 1; //Months are zero based
		     var curr_year = d.getFullYear();
		     var today = (curr_date + "/" + curr_month + "/" + curr_year);
		     order.set('date', today);
		  order.one('didCreate', this, function(){
		    this.transitionToRoute('orders.show', order);
		  });
		  this.get('store').commit();
		},
	},
	

	bookingDidChange: function() {
		console.log('booking changed');
		var self = this;
		var booking = self.get('selectedBooking');
		console.log(booking);
		//set booking
		//re-set user
		var user = self.get('content.user');
		//set fields (less copy-pasting for the user)
		self.set('content.booking', booking);
		self.set('content.amount', booking.get('deposit'));

	}.observes('selectedBooking'),

	link: function() {
		if(this.get('linked') == false) {
			this.set('linked', true);
			console.log('link set to true');
		} else {
			this.set('linked', false)
		}
	},

	linked: false,

	linkUp: function() {
		if(this.get('linked') == true) {
			this.set('content.deliveryFirstnames', this.get('content.billingFirstnames'));
			this.set('content.deliverySurname', this.get('content.billingSurname'));
			this.set('content.deliveryAddress', this.get('content.billingAddress'));
			this.set('content.deliveryCity', this.get('content.billingCity'));
			this.set('content.deliveryPostcode', this.get('content.billingPostcode'));
			this.set('content.deliveryCountry', this.get('content.billingCountry'));
		} else {}
	}.observes('content.billingFirstnames', 'content.billingSurname', 'content.billingAddress', 'content.billingCity', 'content.billingPostcode', 'content.billingCountry')

});


