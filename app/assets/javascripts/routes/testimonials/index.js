App.TestimonialsIndexRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').find('testimonial');
  },

  setupController: function(controller, model) {
  	controller.set('model', model);
  },
  

});