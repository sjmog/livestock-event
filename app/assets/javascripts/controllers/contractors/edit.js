App.ContractorsEditController = Ember.ObjectController.extend({

  actions: {
    save: function(contractor) {
      contractor.one('didCreate', this, function(){
        this.transitionToRoute('contractors.show', contractor);
      });
      contractor.one('didUpdate', this, function(){
        this.transitionToRoute('contractors.show', contractor);
      });
      this.get('store').commit();
    },
    sameName: function() {
      var name = this.get('name');
      this.set('companyName', name);
    },
  },
  

  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('contractors.show', model);
  },

  init: function() {
  	this._super();
  }

});