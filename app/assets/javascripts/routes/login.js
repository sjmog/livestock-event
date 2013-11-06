
  App.LoginRoute = Ember.Route.extend({
    model: function() {
      return Ember.Object.create();
    },
    setupController: function(controller, model) {
      return controller.set("errorMsg", "");
    },
    events: {
      cancel: function() {
        log.info("cancelling login");
        return this.transitionTo('index');
      },
      login: function() {
        log.info("Logging in...");
        return App.login(this);
      }
    }
  });

