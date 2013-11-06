App.HelpinghandsView = Ember.View.extend({
	templateName: 'helpinghands',
	classNames: ['tile content-tile mix exhibitor visitor general_info all tile-2-wide tile-2-tall'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});
