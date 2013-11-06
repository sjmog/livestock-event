App.VisitorTicketsView = Ember.View.extend({
	templateName: 'visitor_tickets',
	classNames: ['tile content-tile rabdfpink mix visitor_tickets visitor tile-1-wide tile-half-tall'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 1,
	exhibitorImportance: 9,
	generalImportance: 4,
	width: 1,
	height: 0.5,
	
	didInsertElement: function() {
		//for the flipping
		$('#visitorPricing').click(function() {
			$('.tile.visitor_tickets .front').addClass('flipped');
			$('.tile.visitor_tickets .back').addClass('flipped');
		});
		//flip back
		$('#visitor_tickets-closeButton').click(function() {
			$('.tile.visitor_tickets .front').removeClass('flipped');
			$('.tile.visitor_tickets .back').removeClass('flipped');
		});
		
	}
});


