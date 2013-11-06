App.SupportersShowView = Ember.View.extend({
	templateName: 'supporters/show',
	classNames: ['tile innerTile content-tile supporters general_info all tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
	}
});