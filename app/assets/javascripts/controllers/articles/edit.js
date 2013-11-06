App.ArticlesEditController = Ember.ObjectController.extend({

  actions: {
    save: function(article) {
      article.one('didCreate', this, function(){
        this.transitionToRoute('articles.show', article);
      });
      article.one('didUpdate', this, function(){
        this.transitionToRoute('articles.show', article);
      });
      var publishedDate = this.set('model.published');
      var theYear = this.get('model.year');
      var theDay = this.get('model.day');
      var theMonth = (this.get('model.monthNumber') -1);
      console.log(theYear + ' and the day ' + theDay + ' and the month ' + theMonth);
      var theDate = new Date(theYear, theMonth, theDay);
      this.set('model.published', theDate);
      this.get('store').commit();
    },
  },
  

  redirectToModel: function() {
    var router = this.get('target');
    var model = this.get('model');
    router.transitionTo('articles.show', model);
  },

  init: function() {
  	this._super();
  	if(this.get('image') === null) {
  		this.set('image', 'http://placehold.it/620x310');
  	}
  	else {};
  }

});