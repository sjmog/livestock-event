App.OrdersEditView = Ember.View.extend({
	templateName: 'orders/edit',
	classNames: ['tile innerTile content-tile rabdforange exhibitor all tile-4-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 4,
	didInsertElement: function() {
		window.scrollTo(0,0);
	}
});