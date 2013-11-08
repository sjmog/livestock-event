App.AdminRoute = Ember.Route.extend({
	renderTemplate: function() {
		var adminController = this.controllerFor('admin');
		var statsController = this.controllerFor('stats');
		var bookingsIndexController = this.controllerFor('bookings.index');
		var usersIndexController = this.controllerFor('users.index');
		var ordersIndexController = this.controllerFor('orders.index');
		this.render('admin', {
			into: 'application',
			controller: adminController
		});
		this.render('stats', {
			into: 'admin',
			outlet: 'stats',
			controller: statsController
		});
		this.render('bookings.index', {
			into: 'admin',
			outlet: 'booking',
			controller: bookingsIndexController
		});
		this.render('users.index', {
			into: 'admin',
			outlet: 'users',
			controller: usersIndexController
		});
		this.render('orders.index', {
			into:'admin',
			outlet:'orders',
			controller: ordersIndexController
		});

	},
	setupController: function() {
		var routeHandler = this;
		var bookingsIndexController = this.controllerFor('bookings.index');
		bookingsIndexController.set('model', this.get('store').find('booking'));
		var usersIndexController = this.controllerFor('users.index');
		usersIndexController.set('model', this.get('store').find('user'));
		var ordersIndexController = this.controllerFor('orders.index');
		ordersIndexController.set('model', this.get('store').find('order'));
	}
});