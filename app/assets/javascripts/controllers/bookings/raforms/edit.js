App.RaformsEditController = Ember.ObjectController.extend({
  needs: ['application'],
  init: function() {
    this._super();
    this.set('helper', false);
  },
  helper:null,

  riskLevels: [
  	{fullName: "High", value: 'high'},
  	{fullName: "Medium", value: 'medium'},
  	{fullName: "Low", value: 'low'},
  ],
  rAssociations: [
  	{fullName: "Build Up", value: 'build-up'},
  	{fullName: "In Show", value: 'in-show'},
    {fullName: "Breakdown", value: 'breakdown'}
  ],

  actions: {
      addHazard: function() {
        this.get('model.hazards').createRecord({raform: this.get('model')});
      },

      removeHazard: function(hazard) {
        hazard.deleteRecord();
        hazard.save();
      },

      toggleComplex: function() {
        console.log('toggling helper');
        this.get('helper') ? this.set('helper', false) : this.set('helper', true);
      },

      saveHazard: function(hazard) {
        hazard.one('didCreate', this, function(){
          console.log('hazard saved');
        });
        hazard.save();
      },

      update: function(raform) {
        raform.one('didUpdate', this, function(){
          var bookingId = raform._data.booking.id;
          this.transitionToRoute('bookings.show', bookingId);
        });
        raform.one('didCreate', this, function(){
          var bookingId = raform._data.booking.id;
          this.transitionToRoute('bookings.show', bookingId);
        });
        raform.save();
      },

      save: function(raform) {
        raform.one('didCreate', this, function(){
          var bookingId = raform._data.booking.id;
          this.transitionToRoute('bookings.show', bookingId);
        });
        raform.save();
      },
  }

});


