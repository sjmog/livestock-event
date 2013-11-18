App.ContractorsIndexView = Ember.View.extend({
	templateName: 'contractors/index',
	classNames: ['tile innerTile content-tile contractors list-tile scrollTile general_info all tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		
	}
});
