App.BookingsTcsView = Ember.View.extend({
	templateName: 'bookings/tcs',
	classNames: ['tile content-tile tcs rabdforange mix general_info all tile-8-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {
		var view = this;

	},
});