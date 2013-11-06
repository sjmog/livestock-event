App.WhatsOnView = Ember.View.extend({
	templateName: 'whats-on',
	classNames: ['tile whats_on tab-tile content-tile mix exhibitor visitor general_info all tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 2,
	exhibitorImportance: 2,
	generalImportance: 3,
	width: 2,
	height: 1,
	didInsertElement: function() {
		//carouTabs code
		var $view = this.$();
		var $carous = $view.find('.carouTabs'); //all carousels in each carouTabs containers, which may be nested
		for (var i = 0; i < $carous.length; i++) {
			var $item = $($carous[i]);
			$item.children('.carouTab:first-of-type').addClass('activeCarou');
			$item.find('.carouTabTitle').click(function() {
				var $parent = $(this).parent('.carouTab');
				$parent.animo( { animation: 'fadeOutLeft', duration: 0.2 }, function() {
					$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
					$parent.animo( { animation: 'fadeInRight', duration: 0.2 } );
				});
			
		});
		};
	}
});
