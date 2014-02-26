App.TestimonialController = Ember.ObjectController.extend({
	needs: ['application'],
  destroy: function() {
    if (!confirm('Are you sure?')) return;
    this.get('model').deleteRecord();
    this.get('store').commit();
    this.get('target.router').transitionTo('testimonials');
  }

});
