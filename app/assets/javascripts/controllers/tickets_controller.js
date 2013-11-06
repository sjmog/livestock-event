App.TicketsController = Ember.ArrayController.extend({
	needs: ['index'],
	tickets:null,
	ticketPrice: function() {
		return this.get('tickets')*15
	}.property('tickets'),
	oneTicket: function() {
		if(this.get('tickets') ===1) {return true}
			else {return false};
	}.property('tickets'),
	init:function() {
		this._super();
		this.set('tickets', this.get('controllers.index.tickets'));
	}
});

