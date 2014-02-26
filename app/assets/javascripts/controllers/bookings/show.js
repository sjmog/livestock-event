App.BookingsShowController = Ember.ObjectController.extend({
needs: ['application'],
allDone: function() {
	if(this.get('model.raform.complete') 
		&& this.get('model.raform.complete')
		&& this.get('model.raform.complete'))
		{ return true; }
	else
		{ return false; }
}.property('model.raform.complete', 'model.hsform.complete', 'model.showform.complete'),

});


