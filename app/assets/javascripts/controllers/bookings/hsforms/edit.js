App.HsformsEditController = Ember.ObjectController.extend({
  needs: ['application'],
  update: function(hsform) {
    hsform.one('didUpdate', this, function(){
      var bookingId = hsform._data.booking.id;
      this.transitionToRoute('bookings.show', bookingId);
    });
    hsform.save();
  },
  
  save: function(hsform) {
    hsform.one('didCreate', this, function(){
      var bookingId = hsform._data.booking.id;
      this.transitionToRoute('bookings.show', bookingId);
    });
    hsform.save();
  },


});


