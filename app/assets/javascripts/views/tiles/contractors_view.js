App.ContractorsTileView = Ember.View.extend({
	templateName: 'contractors_tile',
	classNames: ['tile content-tile contractors content-tile mix exhibitor tile-half-tall rabdforange tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 9,
	exhibitorImportance: 5,
	generalImportance: 6,
	width: 1,
	height: 1,
	flipped:false,
	toggleFlip: function() {
		var view = this;
		var flipped = view.flipped;
		if(flipped) {
			view.set('flipped', false);
		}
		else {
			view.set('flipped', true);
		}
	},
	didInsertElement: function() {
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


