App.PricebarView = Ember.View.extend({
	templateName: 'pricebar',
	didInsertElement: function() {
	},
	priceExists: function() {
		if (this.get('price')) {
			$('#price_bar').removeClass('pbDown');
		} else {
			$('#price_bar').addClass('pbDown');
		};
	}.property('price'),
});