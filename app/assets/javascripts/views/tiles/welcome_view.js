App.WelcomeView = Ember.View.extend({
	templateName: 'welcome',
	classNames: ['tile welcome tab-tile content-tile mix general_info all tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 9,
	exhibitorImportance: 9,
	generalImportance: 2,
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
			$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
		});
		};
	}
});
