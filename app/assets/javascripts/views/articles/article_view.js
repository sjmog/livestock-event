App.ArticleView = Ember.View.extend({
	templateName: 'articles/show',
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
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