App.VisitorTicketsView = Ember.View.extend({
	templateName: 'visitor_tickets',
	classNames: ['tile content-tile rabdfpink mix visitor_tickets visitor tile-1-wide tile-half-tall'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 1,
	exhibitorImportance: 9,
	generalImportance: 4,
	width: 1,
	height: 0.5,
	flipped:false,
	toggleFlip: function() {

		var view = this;
		var flipped = view.flipped;
		if(flipped) {
			view.set('flipped', false);
		}
		else {
			analytics.track('Looked at Ticket prices');
			view.set('flipped', true);
		}
	},
	didInsertElement: function() {
		
	}
});


