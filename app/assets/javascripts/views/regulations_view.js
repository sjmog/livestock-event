App.RegulationsView = Ember.View.extend({
	templateName: 'regulations',
	classNames: ['tile content-tile innerTile mix general_info all tile-massive-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 14,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});