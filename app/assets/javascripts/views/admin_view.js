App.AdminView = Ember.View.extend({
	templateName: 'admin',
	didInsertElement: function() {
		//mixitup init
				console.log('mixing container...');
				// $('.container').mixitup({
				//     onMixEnd: function() {
				//       gridify()}
				//  });
				$('.isotopeContainer').isotope({
					itemSelector:'.tile:not(.filters)',
					itemPositionDataEnabled:true,
					onLayout: function($elems, instance) {
						console.log('isotope layout');
					},
					masonry: {
						columnWidth: 320
					}
				});
		
	}
});

