
App.NewTestimonialRoute = Ember.Route.extend({

  renderTemplate: function() {
    this.render('edit_testimonial', {controller: 'new_testimonial'});
  },

  model: function() {
    return App.Testimonial.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  }

});
