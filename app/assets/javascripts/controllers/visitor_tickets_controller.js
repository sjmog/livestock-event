App.VisitorTicketsController = Ember.ArrayController.extend({
	needs: ['application'],
	tickets:0,
	ticketPrice: function() {
		return this.get('tickets')*15;
	}.observes('tickets')
});