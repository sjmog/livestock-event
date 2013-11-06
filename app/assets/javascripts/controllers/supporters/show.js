App.SupportersShowController = Ember.ObjectController.extend({

  destroy: function() {
    if (!confirm('Are you sure?')) return;
    this.get('model').deleteRecord();
    this.get('store').commit();
    this.get('target.router').transitionTo('supporters.index');
  },
  isSameName: function() {
  	if(this.get('name') === this.get('companyName')) {
  		return true;
  	} else {return false;}
  }.property('name', 'companyName'),

});

