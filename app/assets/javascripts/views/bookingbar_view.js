App.BookingbarView = Ember.View.extend({
	templateName: 'bookingbar',
	didInsertElement: function() {
	},
	priceExists: function() {
		if (this.get('price')) {
			$('#booking_bar').addClass('pbDown');
		} else {
			$('#booking_bar').removeClass('pbDown');
		};
	}.property('price'),
});