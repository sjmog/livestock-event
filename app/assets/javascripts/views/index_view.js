App.IndexView = Ember.View.extend({
	templateName: 'index',
	classNames: [''],
	didInsertElement: function() {
		var controller = this.get('controller');
		//sidebar
		$('.sidebarHolder').height(0);
		//placeholder support for IE
		$('input, textarea').placeholder();
		var $container = $('.isotopeContainer');
		$container.isotope({
			itemSelector:'.tile:not(.filters)',
			itemPositionDataEnabled:true,
			onLayout: function($elems, instance) {
				console.log('isotope layout');
				//height control for main container
				// var theHeight = $container.height();
				// console.log(theHeight); 
				// $('.main').height(theHeight);
			},
			masonry: {
				columnWidth: 320
			},
			getSortData : {
			   visitorImportance : function ( $elem ) {
			       return $elem.attr('data-visitorimportance');
			    },
			    exhibitorImportance : function ( $elem ) {
			        return $elem.attr('data-exhibitorimportance');
			      },
			      generalImportance : function ( $elem ) {
			          return $elem.attr('data-generalimportance');
			        }
			  }
		});
		//filtering
		$('.filter#general_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'generalImportance'});
			controller.set('currentFilter', null);
			return false;
		});
		$('.filter#visitor_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'visitorImportance'});
			controller.set('currentFilter', 'visitor');
			return false;
		});
		$('.filter#exhibitor_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'exhibitorImportance'});
			controller.set('currentFilter', 'exhibitor');
			return false;
		});
		$('.filter#all_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'generalImportance'});
			controller.set('currentFilter', null);
			return false;
		});
		//init grid
		$('.filter#all_filter').click();
		
	}
});

