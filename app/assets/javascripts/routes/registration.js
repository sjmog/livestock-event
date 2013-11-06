
  App.RegistrationRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      this.controller.set('model', User.createRecord());
    },
    events: {
      
      cancel: function() {
        log.info("cancelling registration");
        return this.transitionTo('index');
      }
    }
  });
