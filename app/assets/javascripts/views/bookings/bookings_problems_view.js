App.BookingsProblemsView = Ember.View.extend({
	templateName: 'bookings/problems',
	classNames: ['tile content-tile rabdforange mix general_info all tile-1-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 1,
	height: 1,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});