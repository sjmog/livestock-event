App.ContractorsShowView = Ember.View.extend({
	templateName: 'contractors/show',
	classNames: ['tile innerTile scrollTile innerTile content-tile contractors general_info all tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
	}
});