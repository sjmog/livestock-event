App.UsersEditView = Ember.View.extend({
	templateName: 'users/edit',
	classNames: ['tile content-tile rabdfblue mix general_info all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);

	}
});