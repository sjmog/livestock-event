App.ContentsbookingView = Ember.View.extend({
	templateName: 'contentsbooking',
	didInsertElement: function() {
		$('#booking_bar').animo({animation: "fadeInUpBig", duration: 0.5, keep: true});
	},
	willDestroyElement:function() {
		Ember.run(function() {
			$('#booking_bar').animo({animation: "fadeOutDown", duration: 0.5, keep: true})});
	},
	priceExists: function() {
		if (this.get('price')) {
			$('#booking_bar').addClass('pbDown');
		} else {
			$('#booking_bar').removeClass('pbDown');
		};
	}.property('price'),
});