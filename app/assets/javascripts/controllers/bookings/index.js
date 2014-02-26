App.BookingsIndexController = Em.ArrayController.extend({
	needs: ['application'],
	sortProperties: ['content.id'],
	sortAscending: true
})
