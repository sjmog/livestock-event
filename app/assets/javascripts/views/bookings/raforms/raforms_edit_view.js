App.RaformsEditView = Ember.View.extend({
	templateName: 'bookings/raforms/edit',
	classNames: ['tile content-tile rabdforange mix general_info all tile-5-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		window.scrollTo(0,0);
	}
});