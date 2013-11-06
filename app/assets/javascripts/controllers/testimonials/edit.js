App.TestimonialsEditController = Ember.ObjectController.extend({

  save: function() {
    this.get('store').commit();
    this.redirectToModel();
  },

  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('testimonials.show', model);
  },

  categories: [
  	{fullName: "Visitor", value: 'visitor'},
  	{fullName: "Exhibitor", value: 'exhibitor'},
  	{fullName: "Visitor & Exhibitor", value: 'visitor exhibitor'}
  ],

  routes: function() {
    var routeNames = App.Router.router.recognizer.names;
    var result=[];
    var routes=[];
    for(var i in routeNames) {
        result.push([i, routeNames[i]]);
      };
      result.forEach(function(item, index) {
        var segments = [];
        var currentItemPaths = item[1].segments;
        currentItemPaths.forEach(function(item) {
          segments.push(item.string);
        });
        routes.push({route: item[0], path: segments.join("/")});
      });
    return routes;
  }.property('id'),

});


