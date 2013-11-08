App.OrdersIndexView = Ember.View.extend({
	templateName: 'orders/index',
	classNames: ['tile innerTile content-tile rabdforange exhibitor all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 4,
	controller: this.controller,
	didInsertElement: function() {
	}
});