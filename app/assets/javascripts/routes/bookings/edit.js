App.BookingsEditRoute = Ember.Route.extend({

  renderTemplate: function() {
  	var bookingsEditController = this.controllerFor('bookings.edit');
  	this.render('bookings/edit', {
  		into: 'application',
  		controller: bookingsEditController
  	});
  },

});
