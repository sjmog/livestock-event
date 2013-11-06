App.TestimonialsNewRoute = Ember.Route.extend({

  model: function() {
    return App.Testimonial.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },

  setupController: function(controller, model) {
  	controller.set('model', model);
  },
  

});
