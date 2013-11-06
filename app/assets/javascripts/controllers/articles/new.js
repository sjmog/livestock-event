// inherit from edit controller
App.ArticlesNewController = App.ArticlesEditController.extend({

init: function() {
	this._super();
	this.set('image', 'http://placehold.it/620x310');
}
});
