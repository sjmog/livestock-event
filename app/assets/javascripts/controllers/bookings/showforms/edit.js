App.ShowformsEditController = Ember.ObjectController.extend({
  needs: ['application'],
  update: function(showform) {
    showform.one('didUpdate', this, function(){
      var bookingId = showform._data.booking.id;
      this.transitionToRoute('bookings.show', bookingId);
    });
    showform.save();
  },
  
  save: function(showform) {
    showform.one('didCreate', this, function(){
      var bookingId = showform._data.booking.id;
      this.transitionToRoute('bookings.show', bookingId);
    });
    showform.save();
  },


});


