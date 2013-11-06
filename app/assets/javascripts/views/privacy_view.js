App.PrivacyView = Ember.View.extend({
	templateName: 'privacy',
	classNames: ['tile content-tile rabdfblue innerTile scrollTile privacy mix general_info all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 3,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});