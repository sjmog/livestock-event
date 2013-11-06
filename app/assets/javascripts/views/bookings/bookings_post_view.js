App.BookingsPostView = Ember.View.extend({
	templateName: 'bookings/post',
	classNames: ['tile content-tile rabdforange mix general_info all tile-3-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});