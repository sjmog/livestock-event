App.SocialView = Ember.View.extend({
	templateName: 'social',
	classNames: ['tile social content-tile list-tile mix exhibitor visitor general_info all tile-1-wide tab-tile'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 2,
	exhibitorImportance: 3,
	generalImportance: 2,
	width: 1,
	height: 1,
	tab1: true,
	tab2: false,
	tab3: false,
	didInsertElement: function() {
		//carouTabs code with added tab tracking
				var view = this;
				var $view = this.$();
				var $carous = $view.find('.carouTabs'); //all carousels in each carouTabs containers, which may be nested
				for (var i = 0; i < $carous.length; i++) {
					var $item = $($carous[i]);
					$item.children('.carouTab:first-of-type').addClass('activeCarou');
					$item.find('.carouTabTitle').click(function() {
						var tab = $(this).attr('data-tab');
						var $parent = $(this).parent('.carouTab');
					$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
					if (tab === "1")
						{
							view.set('tab1', true);
							view.set('tab2', false);
							view.set('tab3', false);
						}
					else if (tab === "2")
						{
							view.set('tab1', false);
							view.set('tab2', true);
							view.set('tab3', false);
						}
					else if (tab === "3")
						{
							view.set('tab1', false);
							view.set('tab2', false);
							view.set('tab3', true);
						}
				});
				};
	}
});



