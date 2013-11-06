App.UsersShowView = Ember.View.extend({
	templateName: 'users/show',
	classNames: ['tile content-tile rabdfblue mix general_info all tile-3-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 3,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});