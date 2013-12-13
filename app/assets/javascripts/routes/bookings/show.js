

App.BookingsShowRoute = Ember.Route.extend({

  actions: {

    },
  
  beforeModel: function() {
    this._super();
    analytics.track('Viewed a Booking');
  }
  
});

