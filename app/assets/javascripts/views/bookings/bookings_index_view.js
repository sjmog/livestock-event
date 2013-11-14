App.BookingsIndexView = Ember.View.extend({
	templateName: 'bookings/index',
	classNames: ['tile content-tile rabdforange mix general_info all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,
	didInsertElement: function() {
		// //table sorting via tablesorter
		// 	var $table = this.$().find('table');
		// Ember.run.later(function() {
			
		// 	$table.tablesorter();
		// 	$table.trigger("update");
		// 	var sorting = [[0,0]];
		// 	$table.trigger("sorton",[sorting]);
		// }, 2000);
		//table sorting via dataTable
		var $table = this.$().find('table');
		Ember.run.later(function() {
			$table.dataTable();
		}, 1000);
	}
});
