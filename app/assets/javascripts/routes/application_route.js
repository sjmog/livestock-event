App.ApplicationRoute = Ember.Route.extend({

	events: {
		register: function() {
		  log.info("Registering...");
		  return register(this);
		},
		logout: function() {
	      App.AuthManager.reset();
	      this.transitionTo('index');
		},
		
	},

	init: function() {
	   this._super();
	   App.AuthManager = App.AuthManager.create();
	 },

});
