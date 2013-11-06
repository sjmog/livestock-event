App.SupportersEditController = Ember.ObjectController.extend({

  actions: {
    save: function(supporter) {
      supporter.one('didCreate', this, function(){
        this.transitionToRoute('supporters.show', supporter);
      });
      supporter.one('didUpdate', this, function(){
        this.transitionToRoute('supporters.show', supporter);
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
    router.transitionTo('supporters.show', model);
  },

  init: function() {
  	this._super();
  }

});