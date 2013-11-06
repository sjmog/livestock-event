App.SocialView = Ember.View.extend({
	templateName: 'social',
	classNames: ['tile social content-tile list-tile mix exhibitor visitor general_info all tile-1-wide tab-tile'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 2,
	exhibitorImportance: 3,
	generalImportance: 2,
	width: 1,
	height: 1,
	fbPosts: null,
	didInsertElement: function() {
		//foundation orbit
		this.$().foundation('orbit', {
		  timer_speed: 999999999,
		  animation_speed: 250
		});
		var view = this;
		FB.api('/238456219616890/feed', function(response) {
			$.each(response, function() {
				var message = this.message;
				console.log(message);
			});
		 
		});
		//tabs
		var $tabs = this.$().find('.tab');
		var $prevTab;
		$tabs.click(function() {
			$tabs.not(this).removeClass('currentTab');
			$(this).addClass('currentTab');
			$prevTab = $(this).prev('.tab');
			$tabs.not($prevTab).removeClass('prevTab');
			$prevTab.addClass("prevTab");
		});
	}
});



