App.BookingsEditRoute = Ember.Route.extend({


  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
  	var bookingsEditController = this.controllerFor('bookings.edit');
  	this.render('bookings/edit', {
  		into: 'application',
  		controller: bookingsEditController
  	});
  },

});
