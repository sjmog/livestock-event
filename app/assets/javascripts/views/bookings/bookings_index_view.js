App.BookingsIndexView = Ember.View.extend({
	templateName: 'bookings/index',
	classNames: ['tile content-tile rabdforange mix general_info all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,
	didInsertElement: function() {

	}
});
