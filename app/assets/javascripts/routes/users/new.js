App.UsersNewRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this.controller.set('model', Ember.Object.create());
  }
});