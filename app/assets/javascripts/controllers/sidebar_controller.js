App.SidebarController=Ember.ArrayController.extend({
	needs:['application'],
	articles: null,
	testimonials: null,
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
	},
});