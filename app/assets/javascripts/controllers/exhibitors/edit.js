App.ExhibitorsEditController = Ember.ObjectController.extend({

  actions: {
    save: function(exhibitor) {
      exhibitor.one('didCreate', this, function(){
        this.transitionToRoute('exhibitors.show', exhibitor);
      });
      exhibitor.one('didUpdate', this, function(){
        this.transitionToRoute('exhibitors.show', exhibitor);
      });
      this.get('store').commit();
    },
  },
  

  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('exhibitors.show', model);
  },

  init: function() {
  	this._super();
  }

});