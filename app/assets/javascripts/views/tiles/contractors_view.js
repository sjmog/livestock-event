App.ContractorsTileView = Ember.View.extend({
	templateName: 'contractors_tile',
	classNames: ['tile content-tile contractors content-tile mix exhibitor tile-half-tall general_info tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 9,
	exhibitorImportance: 5,
	generalImportance: 6,
	width: 1,
	height: 1,
	didInsertElement: function() {
		//for the flipping
		$('#contractorTimescales').click(function() {
			$('.tile.contractors .front').addClass('flipped');
			$('.tile.contractors .back').addClass('flipped');
		});
		//flip back
		$('#contractors-closeButton').click(function() {
			$('.tile.contractors .front').removeClass('flipped');
			$('.tile.contractors .back').removeClass('flipped');
		});
		//carouTabs code
		var $view = this.$();
		var $carous = $view.find('.carouTabs'); //all carousels in each carouTabs containers, which may be nested
		for (var i = 0; i < $carous.length; i++) {
			var $item = $($carous[i]);
			$item.children('.carouTab:first-of-type').addClass('activeCarou');
			$item.find('.carouTabTitle').click(function() {
				var $parent = $(this).parent('.carouTab');
			$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
		});
		};
	}
});


