App.NumberFieldController = Ember.ObjectController.extend({
	tickets:0,
	ticketPrice: function() {
		return this.get('tickets')*15;
	}.observes('tickets')
});
