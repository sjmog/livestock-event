App.Testimonial = DS.Model.extend({

  image: DS.attr('string'),

  attribution: DS.attr('string'),

  location: DS.attr('string'),

  quote: DS.attr('string'),

  category: DS.attr('string'),

  callRoute: DS.attr('string'),

  callRouteName: DS.attr('string'),

  callIcon: DS.attr('string'),

  slideClass: function() {
  	return "testimonial_" + this.get('id');
  }.property('id'),

});

