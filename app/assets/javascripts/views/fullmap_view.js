App.FullmapView = Ember.View.extend({
	templateName: 'fullmap',
	classNames: ['tile content-tile why-exhibit rabdforange innerTile mix general_info all tab-tile tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {
		
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});