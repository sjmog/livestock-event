App.TilesIndexRoute = Ember.Route.extend({
	model: function() {
		return App.HalfTile.createRecord({
			tileTitle: true,
			backButton: true,
			title: 'daves tile',
			flipTile: true,
			backTileTitle: true,
			backTitle: 'marks side',
			buttonTile: true,
			button1Icon: 'icon-help',
			button2Icon: 'icon-help',
			button3Icon: 'icon-help',
			button4Icon: 'icon-help',
			button1Text: 'yo',
			button2Text: 'check',
			button3Text: 'me',
			button4Text: 'out'
		})
	},
	setupController: function(controller, model) {
		controller.set('model', model);
	}
});