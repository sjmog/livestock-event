App.OrdersEditRoute = Ember.Route.extend({

  actions: {
      
    },
  
  
  setupController: function(controller, model) {
  //	console.log('setupController');

  	controller.set('model', model);
  //	console.log(controller.get('content')); //should be same as previous line
  //	console.log('syncing');
  	
  },
  
  
});


