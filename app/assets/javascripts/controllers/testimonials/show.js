App.TestimonialsShowController = Ember.ObjectController.extend({

  destroy: function() {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    this.get('model').deleteRecord();
    this.get('store').commit();
    this.get('target.router').transitionTo('testimonials.index');
  }

});


