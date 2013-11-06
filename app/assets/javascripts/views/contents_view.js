App.ContentsView = Ember.View.extend({
	templateName: 'contents',
	didInsertElement: function() {
		$('#price_bar').animo({animation: "fadeInUpBig", duration: 0.5, keep: true});
	},
	willDestroyElement:function() {
		Ember.run(function() {
			$('#price_bar').animo({animation: "fadeOutDown", duration: 0.5, keep: true})});
	},
	priceExists: function() {
		if (this.get('price')) {
			$('#price_bar').removeClass('pbDown');
		} else {
			$('#price_bar').addClass('pbDown');
		};
	}.property('price'),
});