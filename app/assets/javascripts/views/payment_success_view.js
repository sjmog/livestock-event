App.PaymentSuccessView = Ember.View.extend({
	templateName: 'payment-success',
	classNames: ['tile tab-tile rabdfblue scrollTile content-tile mix rabdfInfo exhibitor visitor general_info all tile-2-wide tile-4-tall'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 3,
	exhibitorImportance: 2,
	generalImportance: 3,
	width: 2,
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
	}
});
