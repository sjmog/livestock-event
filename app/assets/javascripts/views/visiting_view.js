App.VisitingView = Ember.View.extend({
	templateName: 'visiting',
	classNames: ['tile visiting innerTile scrollTile content-tile mix exhibitor visitor general_info all tile-2-wide tile-2-tall'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 1,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});
