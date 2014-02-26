App.EditTestimonialController = Ember.ObjectController.extend({
  needs: ['application'],
  save: function() {
    this.get('store').commit();
    this.redirectToModel();
  },

  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('testimonial', model);
  },

  writeDown: function(url) {
  	this.image = url;
  	console.log('writedown activated with url ' + url);
  	console.log('this.image is now ' + this.image);
  }

});

