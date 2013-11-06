App.SidebarView = Ember.View.extend({
	templateName: 'sidebar',
	classNames: ['sidebarView'],
	didInsertElement: function() {

		//placeholder support for IE
		$('input, textarea').placeholder();

		var $container = $('.sidebar');
		$container.isotope({
			itemSelector:'.tile:not(.filters)',
			itemPositionDataEnabled:true,
			onLayout: function($elems, instance) {
				console.log('isotope layout');
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
			return false;
		});
		$('.filter#visitor_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			var $bgShiftTile = $('.rabdforange.visitor');
			$bgShiftTile.removeClass('rabdforange').addClass('rabdfpink');
			$bgShiftTile.find('.orange').removeClass('orange').addClass('pink');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'visitorImportance'});
			return false;
		});
		$('.filter#exhibitor_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			var $bgShiftTile = $('.rabdfpink.exhibitor');
			$bgShiftTile.removeClass('rabdfpink').addClass('rabdforange');
			$bgShiftTile.find('.pink').removeClass('pink').addClass('orange');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'exhibitorImportance'});
			return false;
		});
		$('.filter#all_filter').click(function() {
			$('.filter').not($(this)).removeClass('activeFilter');
			$(this).addClass('activeFilter');
			var selector = $(this).attr('data-filter');
			$container.isotope({filter:selector, sortBy:'generalImportance'});
			return false;
		});
		//init grid
		$('.filter#all_filter').click();
		
	}
});

