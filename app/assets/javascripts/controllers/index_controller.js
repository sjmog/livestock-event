App.IndexController = Ember.ArrayController.extend({
	needs: ['news', 'application'],
	articles: null,
	testimonials: null,
	social_ts: null,
	social_fs: null,
	social_ls: null,
	tickets:null,
	currentFilter: null,
	sortedArticles: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('articles'), sortProperties: ['published'], sortAscending: false }
	 	);
	    return sortedResult;
	}.property('articles.@each'),
	sortedSocialTs: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('social_ts'), sortProperties: ['published'], sortAscending: false }
	 	);
	    return sortedResult;
	}.property('social_ts.@each'),
	sortedSocialFs: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('social_fs'), sortProperties: ['published'], sortAscending: false }
	 	);
	    return sortedResult;
	}.property('social_fs.@each'),
	sortedSocialLs: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('social_ls'), sortProperties: ['published'], sortAscending: false }
	 	);
	    return sortedResult;
	}.property('social_ls.@each'),
	filteredTestimonials: function() {
		var controller = this;
		currentFilter = controller.get('currentFilter');
		if(currentFilter) {
			return controller.get('testimonials').filterProperty('category', currentFilter);
		}
		else {return controller.get('testimonials')};
	}.property('currentFilter'),
	ticketPrice: function() {
		return this.get('tickets')*15
	}.property('tickets'),
	oneTicket: function() {
		if(this.get('tickets') ===1) {return true}
			else {return false};
	}.property('tickets'),
	init:function() {
		this._super();
		this.set('articles', App.Article.find());
		this.set('testimonials', App.Testimonial.find());
		this.set('social_ts', App.SocialT.find());
		this.set('social_fs', App.SocialF.find());
		this.set('social_ls', App.SocialL.find());
	},
	currentTestimonial: function() {
		var allTestimonials = this.get('filteredTestimonials');
		// Ember.run.later(function() {
		// 	console.log(Ember.inspect(allTestimonials));
		// 	allTestimonials.forEach(function(item) {
		// 		Ember.run.later(function() {
		// 			console.log(item);
		// 		},200)
		// 	})
		// }, 800)
	}.property('filteredTestimonals'),
});

