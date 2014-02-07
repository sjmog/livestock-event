if (window.history && window.history.pushState) {
    App.Router.reopen({
      location: 'history'
    });
}
  App.Router.reopen({
    rootURL: '/'
  });

  App.Router.map(function() {
    this.route('show-booking');
    this.route('nds-entry');
    this.route('ncs-entry');
    this.route('nbbs-entry');
    this.route('naas-entry');
    this.route('nlsc-entry');
    this.route('nds-accommodation');
    this.route('ncs-accommodation');
    this.route('nbbs-accommodation');
    this.route('naas-accommodation');
    this.route('nlsc-accommodation');
    this.route('schedules');
    this.route('regulations');
    this.route('results');
    //dummy route for admin
    this.route('admin');
    this.route('svgmap');
    this.route('fullmap');
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
    this.resource('exhibitors', function() {
      this.route('index', {
        path: '/'
      });
      this.route('show', {
        path: '/:exhibitor_id'
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
      this.resource('raforms', function() {
        this.route('show', {
          path: '/:raform_id'
        });
        this.route('edit', {
          path: '/:raform_id/edit'
        });
      });
      this.resource('hsforms', function() {
        this.route('show', {
          path: '/:hsform_id'
        });
        this.route('edit', {
          path: '/:hsform_id/edit'
        });
      });
      this.resource('showforms', function() {
        this.route('show', {
          path: '/:showform_id'
        });
        this.route('edit', {
          path: '/:showform_id/edit'
        });
      });
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
    // this.route('admin');
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
