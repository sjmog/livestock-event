App.GettingThereView = Ember.View.extend({
	templateName: 'getting_there',
	classNames: ['tile content-tile getting_there mix exhibitor visitor general_info tab-tile all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 3,
	exhibitorImportance: 3,
	generalImportance: 3,
	width: 1,
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
			$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
		});
		};
	}
});

