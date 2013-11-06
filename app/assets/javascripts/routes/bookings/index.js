App.BookingsIndexRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').find('booking');
  },
  

});