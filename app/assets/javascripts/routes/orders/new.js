App.OrdersNewRoute = Ember.Route.extend({

  actions: {
    willTransition: function (transition) {
          var model = this.get('currentModel');

          if (model && model.get('isDirty')) {
            if (confirm("You have unsaved changes. Click OK to stay on the current page. Click cancel to discard these changes and move to the requested page.")) {
              //Stay on same page and continue editing
              transition.abort();
            } else {
              //Rollback modifications
              var author = this.get('currentModel');
              author.rollback();
              // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
              return true;
            }
          } else {
            // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
            return true;
          }
        }
    },
  
  model: function() {
  	console.log('model');
  	var order = App.Order.createRecord({date: Date.now()});
  	return order;
  },
  
  setupController: function(controller, model) {
  //	console.log('setupController');

  	controller.set('model', model);
  //	console.log(controller.get('content')); //should be same as previous line
  //	console.log('syncing');
  	Ember.run.sync();
  	controller.setup();
  },
  
  
});

