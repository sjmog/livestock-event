App.BookingsStartRoute = Ember.Route.extend({
	setupController: function(controller, model) {
	  this.controller.set('model', User.createRecord());
	}
});