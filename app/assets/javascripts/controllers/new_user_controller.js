App.NewUserController = Ember.ArrayController.extend({
	needs: ['currentUser'],
	init:function() {
		this.set('content', App.User.create({}))
	}
});
