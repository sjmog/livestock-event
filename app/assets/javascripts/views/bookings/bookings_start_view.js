App.BookingsStartView = Ember.View.extend({
	templateName: 'bookings/start',
	classNames: ['tile content-tile rabdforange mix general_info all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});