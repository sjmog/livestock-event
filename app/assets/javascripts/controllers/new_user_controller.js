App.NewUserController = Ember.ArrayController.extend({
	needs: ['currentUser', 'application'],
	init:function() {
		this.set('content', App.User.create({}))
	}
});
