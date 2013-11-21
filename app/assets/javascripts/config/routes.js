if (window.history && window.history.pushState) {
    App.Router.reopen({
      location: 'history'
    });
}
  App.Router.reopen({
    rootURL: '/'
  });

  App.Router.map(function() {
    this.route('svgmap');
    this.resource('contractors', function() {
      this.route('index', {
        path: '/'
      });
      this.route('new', {
        path: '/new'
      });
      this.route('show', {
        path: '/:contractor_id'
      });
      this.route('edit', {
        path: '/:contractor_id/edit'
      });
    });
    this.resource('supporters', function() {
      this.route('index', {
        path: '/'
      });
      this.route('new', {
        path: '/new'
      });
      this.route('show', {
        path: '/:supporter_id'
      });
      this.route('edit', {
        path: '/:supporter_id/edit'
      });
    });
  this.resource('testimonials', function() {
    this.route('index', {
      path: '/'
    });
    this.route('new', {
      path: '/new'
    });
    this.route('show', {
      path: '/:testimonial_id'
    });
    this.route('edit', {
      path: '/:testimonial_id/edit'
    });
  });
  this.resource('orders', function() {
    this.route('index', {
      path: '/'
    });
    this.route('new', {
      path: '/new'
    });
    this.route('show', {
      path: '/:order_id'
    });
    this.route('edit', {
      path: '/:order_id/edit'
    });
  });
  this.route('why-exhibit');
    this.route('application');
    this.route('index', {
      path: '/'
    });
    this.resource('bookings', function() {
      this.route('index', {
        path:'/'
      });
      this.route('start');
      this.route('post');
      this.route('new', {
        path: '/new'
      });
      this.route('show', {
        path: '/:booking_id'
      });
      this.route('edit', {
        path: '/:booking_id/edit'
      });
      this.route('tcs');
      this.route('problems');
      this.route('how');
    });
    this.resource('posts', function() {
      this.route('show', {
        path: '/:post_id'
      });
    });
    this.resource('users', function() {
      this.route('index', {
        path: '/'
      });
      this.route('new', {
        path: '/new'
      });
      this.route('show', {
        path: '/:user_id'
      });
      this.route('edit', {
        path: '/:user_id/edit'
      });
    });
    this.resource('sessions', function() {
      this.route('new');
    });
    this.route('sign-in');
    this.route('login');
    this.route('registration');
    this.route('tickets');
    this.route('admin');
    this.resource('articles', function() {
      this.route('show', {
        path: '/:article_id'
      });
      this.route('new', {
        path: '/new'
      });
      this.route('edit', {
        path: '/:article_id/edit'
      });
    });
    this.route('rabdf');
    this.route('accommodation');
    this.route('awards');
    this.route('past');
    this.route('helpinghands');
    this.route('privacy');
    this.route('exhibiting');
    this.route('demographics');
    this.route('exhibitors');
    this.route('payment-success');
    this.route('payment-incomplete');
    this.route('visiting');
    this.resource('tiles', function() {
      this.route('index', {
        path: '/'
      });
      this.route('new', {
        path: '/new'
      });
      this.route('show', {
        path: '/:tile_id'
      });
      this.route('edit', {
        path: '/:tile_id/edit'
      });
    });
  });
