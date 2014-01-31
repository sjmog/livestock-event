App.ExhibitorsIndexView = Ember.View.extend({
	templateName: 'exhibitors/index',
	classNames: ['tile innerTile content-tile exhibitors list-tile scrollTile general_info all tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		//filters

		var $checkboxes = $('#filterRow').find('.hiddenBox');
		var $filters = $('#filterRow').find('.colorBlock');

		$filters.click(function() {
			var name = $(this).attr('data-name');

			var checkbox = $checkboxes.siblings('[name=' + name + ']');
			checkbox.click();
			
		})
	}
});
