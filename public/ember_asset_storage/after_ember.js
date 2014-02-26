var User = App.User;

App.AuthManager = Ember.Object.extend({
  apiKey: null,
  // Load the current user if the cookies exist and is valid
  init: function() {
    this._super();
    var accessToken = $.cookie('access_token');
    var authUserId  = $.cookie('auth_user');
    if (!Ember.isEmpty(accessToken) && !Ember.isEmpty(authUserId)) {
      this.authenticate(accessToken, authUserId);
    } else {
      this.resetWithoutRedirecting();
    }
  },

  // Determine if the user is currently authenticated.
  isAuthenticated: function() {
    return !Ember.isEmpty(this.get('apiKey.accessToken')) && !Ember.isEmpty(this.get('apiKey.user'));
  },

  // Authenticate the user. Once they are authenticated, set the access token to be submitted with all
  // future AJAX requests to the server.
  authenticate: function(accessToken, userId) {
    console.log('authenticating...');
    console.log(accessToken);
    console.log(userId);

    //set the cookies
    $.cookie('access_token', accessToken);
    $.cookie('auth_user', userId);

    console.log('cookies set');

      var date = new Date();
      var minutes = 240; //4 hour expiry
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      var self = this;
      
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer ' + accessToken }
      });
      
        //creates an API key, which fires the apiKeyObserver
        App.User.find(userId).then(function(user) {
          analytics.identify(userId, {
                    email   : user.email,
                    name    : user.name,
                });
          console.log('creating API key in AuthManager');
         self.set('apiKey', App.ApiKey.create({
           accessToken: accessToken,
           user: user,
           expiredAt: date, 
           }));
         });
      

      
      
    
  },

  // Log out the user
  reset: function() {
    App.__container__.lookup("route:application").transitionTo('index');
    Ember.run.sync();
    Ember.run.next(this, function(){
      this.set('apiKey', null);
      $.cookie('access_token', null);
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer none' }
      });
    });
  },

  //just reset the api key
  resetWithoutRedirecting: function() {
    Ember.run.next(this, function() {
      this.set('apiKey', null);
      $.cookie('access_token', null);
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer none' }
      });
    });
  },

  // Ensure that when the apiKey changes, we store the data in cookies in order for us to load
  // the user when the browser is refreshed.
  apiKeyObserver: function() {
    if (Ember.isEmpty(this.get('apiKey'))) {
      console.log('removing API key');
      $.removeCookie('access_token');
      $.removeCookie('auth_user');
    } else {
      console.log('setting API key cookies');
      
        $.cookie('access_token', this.get('apiKey.accessToken'), {expires: this.get('apiKey.expiredAt')});
        $.cookie('auth_user', this.get('apiKey.user.id'), {expires: this.get('apiKey.expiredAt')});
      
    }
  }.observes('apiKey')
});

// Reset the authentication if any ember data request returns a 401 unauthorized error
DS.rejectionHandler = function(reason) {
  if (reason.status === 401) {
    App.AuthManager.reset();
  }

};
App.Permission = Ember.Object.extend({
  content: null,
  currentUserBinding: "App.currentUser"
});

App.Permissions = {
    _perms:    {},
    register: function(name, klass) { this._perms[name] = klass; },
    get:      function(name, attrs) { return this._perms[name].create(attrs); },
    can:      function(name, attrs) { return this.get(name, attrs).get("can"); }
};

App.Permissions.register("createArticle", App.Permission.extend({
   can: function() {
     return this.get("currentUser.isAdmin");
   }.property("currentUser.isAdmin")
 }));

 App.Permissions.register("showBooking", App.Permission.extend({
   can: function(){
     return this.get("currentUser.isAdmin") || this.get("content.author.id") == this.get("currentUser.id");
   }.property("currentUser.isAdmin", "content")
 }));
//subscribe to all render events

// Ember.subscribe('render', {
//   before: function(name, start, payload){
//     return start;
//   },
//   after: function(name, end, payload, start){
//     var duration = Math.round(end - start);
//     var template = payload.template || '';
//     //console.log(Ember.inspect(payload));
//     //var title;
//     var view = payload.object.toString();
//     console.log('rendered', template, view, 'took', duration, 'ms');
//   }
// });
Ember.View.reopen({

});
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

  App.urls || (App.urls = {});

  App.urls.login = "users/sign_in.json";

  App.urls.register = "users/sign_up.json";

  App.urls.logout = "users/sign_out.json";

window.log = Em.Logger;
App.AboutRABDFRoute = Ember.Route.extend({
  
});
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
App.ApplicationRoute = Ember.Route.extend({

  events: {
    register: function() {
      log.info("Registering...");
      return register(this);
    },
    logout: function() {
        App.AuthManager.reset();
        this.transitionTo('index');
    },
    
  },

  init: function() {
     this._super();
     App.AuthManager = App.AuthManager.create();
   },

});
App.ArticlesEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('article', params.article_id);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var articlesEditController = this.controllerFor('articles.edit');
    this.render('articles/edit', {
      into: 'application',
      controller: articlesEditController
    });
  },
});
App.ArticlesIndexRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('article');
  }
});
App.ArticlesNewRoute = Ember.Route.extend({
  model: function() {
    return App.Article.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var articlesNewController = this.controllerFor('articles.new');
    this.render('articles/new', {
      into: 'application',
      controller: articlesNewController
    });
  },
});
App.ArticlesShowRoute = Ember.Route.extend({
  model: function(params) {
    analytics.track('Viewed an Article', {
        article_id  : params.article_id,
    });
    return this.get('store').find('article', params.article_id);
  },
  renderTemplate: function() {
    var articlesController = this.controllerFor('articles');
    var articlesShowController = this.controllerFor('articles.show');
    this.render('articles/show', {
      into: 'application',
      controller: articlesShowController
    });
  },
});
App.AuthenticatedRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    if (!App.AuthManager.isAuthenticated()) {
      this.redirectToLogin(transition);
    }
  },

  // Redirect to the login page and store the current transition so we can
  // run it again after login
  redirectToLogin: function(transition) {
    var sessionNewController = this.controllerFor('sessions.new');
    sessionNewController.set('attemptedTransition', transition);
    this.transitionTo('sessions.new');
  },

  events: {
    error: function(reason, transition) {
      this.redirectToLogin(transition);
    }
  }
});
App.BookingsEditRoute = Ember.Route.extend({

  renderTemplate: function() {
    var bookingsEditController = this.controllerFor('bookings.edit');
    this.render('bookings/edit', {
      into: 'application',
      controller: bookingsEditController
    });
  },

});
App.BookingsIndexRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').find('booking');
  },
  

});


App.BookingsNewRoute = Ember.Route.extend({

  actions: {
    willTransition: function (transition) {
          var model = this.get('currentModel');

          if (model && model.get('isDirty')) {
            if (confirm("You have unsaved changes. Click OK to stay on the current page. Click cancel to discard these changes and move to the requested page.")) {
              //Stay on same page and continue editing
              transition.abort();
            } else {
              //Rollback modifications
              var author = this.get('currentModel');
              author.rollback();
              // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
              return true;
            }
          } else {
            // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
            return true;
          }
        }
    },
  
  model: function() {
    analytics.track('Started a Booking');
    var booking = App.Booking.createRecord({standNumber: 1});
    return booking;
  },
  
  setupController: function(controller, model) {
  //  console.log('setupController');

    controller.set('model', model);
  //  console.log(controller.get('content')); //should be same as previous line
  //  console.log('syncing');
    Ember.run.sync();
    controller.setup();
  },
  
  
});



App.BookingsShowRoute = Ember.Route.extend({

  actions: {

    },
  
  beforeModel: function() {
    this._super();
    analytics.track('Viewed a Booking');
  }
  
});

App.BookingsStartRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this.controller.set('model', User.createRecord());
  }
});
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
App.ContractorsEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('contractor', params.contractor_id);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var contractorsEditController = this.controllerFor('contractors.edit');
    this.render('contractors/edit', {
      into: 'application',
      controller: contractorsEditController
    });
  },
});
App.ContractorsIndexRoute = Ember.Route.extend({
  model: function() {
    analytics.track('Viewed all Contractors');
    return this.get('store').find('contractor');
  }
});
App.ContractorsNewRoute = Ember.Route.extend({
  model: function() {
    return App.Contractor.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var contractorsNewController = this.controllerFor('contractors.new');
    this.render('contractors/new', {
      into: 'application',
      controller: contractorsNewController
    });
  },
});
App.ContractorsShowRoute = Ember.Route.extend({
  model: function(params) {
    analytics.track('Viewed a Contractor', {
      contractor_id : params.contractor_id
    });
    return this.get('store').find('contractor', params.contractor_id);
  },
  renderTemplate: function() {
    var contractorsController = this.controllerFor('contractors');
    var contractorsShowController = this.controllerFor('contractors.show');
    this.render('contractors/show', {
      into: 'application',
      controller: contractorsShowController
    });
  },
});
App.ExhibitorsIndexRoute = Ember.Route.extend({
  model: function() {
    analytics.track('Viewed public Exhibitor list');
    return this.get('store').find('exhibitor');
  }
});
App.ExhibitorsShowRoute = Ember.Route.extend({
  model: function(params) {
    analytics.track('Viewed an Exhibitor', {
      exhibitor_id : params.exhibitor_id
    });
    return this.get('store').find('exhibitor', params.exhibitor_id);
  },
  renderTemplate: function() {
    var exhibitorsController = this.controllerFor('exhibitors');
    var exhibitorsShowController = this.controllerFor('exhibitors.show');
    this.render('exhibitors/show', {
      into: 'application',
      controller: exhibitorsShowController
    });
  },
});

App.IndexRoute = Ember.Route.extend({
  
});
App.LoadingRoute = Ember.Route.extend({});

  App.LoginRoute = Ember.Route.extend({
    model: function() {
      return Ember.Object.create();
    },
    setupController: function(controller, model) {
      return controller.set("errorMsg", "");
    },
    events: {
      cancel: function() {
        log.info("cancelling login");
        return this.transitionTo('index');
      },
      login: function() {
        log.info("Logging in...");
        return App.login(this);
      }
    }
  });


App.NewTestimonialRoute = Ember.Route.extend({

  renderTemplate: function() {
    this.render('edit_testimonial', {controller: 'new_testimonial'});
  },

  model: function() {
    return App.Testimonial.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  }

});
App.OrdersEditRoute = Ember.Route.extend({

  actions: {
      
    },
  
  
  setupController: function(controller, model) {
  //  console.log('setupController');

    controller.set('model', model);
  //  console.log(controller.get('content')); //should be same as previous line
  //  console.log('syncing');
    
  },
  
  
});


App.OrdersNewRoute = Ember.Route.extend({

  actions: {
    willTransition: function (transition) {
          var model = this.get('currentModel');

          if (model && model.get('isDirty')) {
            if (confirm("You have unsaved changes. Click OK to stay on the current page. Click cancel to discard these changes and move to the requested page.")) {
              //Stay on same page and continue editing
              transition.abort();
            } else {
              //Rollback modifications
              var author = this.get('currentModel');
              author.rollback();
              // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
              return true;
            }
          } else {
            // Bubble the `willTransition` event so that parent routes can decide whether or not to abort.
            return true;
          }
        }
    },
  
  model: function() {
    analytics.track('Started a new Payment');
    var order = App.Order.createRecord({date: Date.now()});
    return order;
  },
  
  setupController: function(controller, model) {
  //  console.log('setupController');

    controller.set('model', model);
  //  console.log(controller.get('content')); //should be same as previous line
  //  console.log('syncing');
    
  },
  
  
});

App.OrdersShowRoute = Ember.Route.extend({
 
  
});

(function() {
  App.PostsRoute = Em.Route.extend({
    model: function() {
      return App.Post.find();
    }
  });

}).call(this);
(function() {
  App.PostsIndexRoute = Em.Route.extend({
    model: function() {
      return App.Post.find();
    }
  });

}).call(this);
(function() {
  App.PostsShowRoute = Em.Route.extend({
    serialize: function(model) {
      return {
        post_id: model.get('param')
      };
    }
  });

}).call(this);

  App.RegistrationRoute = Ember.Route.extend({
    setupController: function(controller, model) {
      this.controller.set('model', User.createRecord());
    },
    events: {
      
      cancel: function() {
        log.info("cancelling registration");
        return this.transitionTo('index');
      }
    }
  });
App.SessionsNewRoute = Ember.Route.extend({
  model: function() {
    return Ember.Object.create();
  }
});
App.SupportersEditRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('supporter', params.supporter_id);
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var supportersEditController = this.controllerFor('supporters.edit');
    this.render('supporters/edit', {
      into: 'application',
      controller: supportersEditController
    });
  },
});
App.SupportersIndexRoute = Ember.Route.extend({
  model: function() {
    analytics.track('Viewed all Supporters');
    return this.get('store').find('supporter');
  }
});
App.SupportersNewRoute = Ember.Route.extend({
  model: function() {
    return App.Supporter.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },
  renderTemplate: function() {
    var supportersNewController = this.controllerFor('supporters.new');
    this.render('supporters/new', {
      into: 'application',
      controller: supportersNewController
    });
  },
});
App.SupportersShowRoute = Ember.Route.extend({
  model: function(params) {
    analytics.track('Viewed a Supporter', {
      supporter_id : params.supporter_id
    });
    return this.get('store').find('supporter', params.supporter_id);
  },
  renderTemplate: function() {
    var supportersController = this.controllerFor('supporters');
    var supportersShowController = this.controllerFor('supporters.show');
    this.render('supporters/show', {
      into: 'application',
      controller: supportersShowController
    });
  },
});
App.TestimonialsIndexRoute = Ember.Route.extend({

  model: function() {
    return this.get('store').find('testimonial');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  },
  

});
App.TestimonialsNewRoute = Ember.Route.extend({

  model: function() {
    return App.Testimonial.createRecord();
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (!model.get('isSaving')) {
      model.deleteRecord();
    }
  },

  setupController: function(controller, model) {
    controller.set('model', model);
  },
  

});

  App.UsersRoute = Em.Route.extend({

  });

  App.UsersIndexRoute = Em.Route.extend({
    model: function() {
      return App.User.find();
    }
  });

App.UsersNewRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this.controller.set('model', Ember.Object.create());
  }
});

  App.UsersShowRoute = Em.Route.extend({
    serialize: function(model) {
      return {
        user_id: model.get('param')
      };
    }
  });

(function() {


}).call(this);
Ember.View.reopen({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    // implement this hook in your own subclasses and run your jQuery logic there
  }
});
;(function ( $, window, document, undefined ) {

  /**
   * animo is a powerful little tool that makes managing CSS animations extremely easy. Stack animations, set callbacks, make magic.
   * Modern browsers and almost all mobile browsers support CSS animations (http://caniuse.com/css-animation).
   *
   * @author Daniel Raftery : twitter/ThrivingKings
   * @version 1.0.2
  */
  function animo( element, options, callback, other_cb ) {
    
    // Default configuration
    var defaults = {
      duration: 1,
      animation: null,
      iterate: 1,
      timing: "linear",
      keep: false
    };

    // Browser prefixes for CSS
    this.prefixes = ["", "-moz-", "-o-animation-", "-webkit-"];

    // Cache the element
    this.element = $(element);

    this.bare = element;

    // For stacking of animations
    this.queue = [];

    // Hacky
    this.listening = false;

    // Figure out where the callback is
    var cb = (typeof callback == "function" ? callback : other_cb);

    // Options can sometimes be a command
    switch(options) {

      case "blur":

        defaults = {
          amount: 3,
          duration: 0.5,
          focusAfter: null
        };

        this.options = $.extend( defaults, callback );

        this._blur(cb);

        break;

      case "focus":

        this._focus();

        break;

      case "rotate":

        defaults = {
          degrees: 15,
          duration: 0.5
        };

        this.options = $.extend( defaults, callback );

        this._rotate(cb);

        break;

      case "cleanse":

        this.cleanse();

        break;

      default:

      this.options = $.extend( defaults, options );

      this.init(cb);
    
      break;
    }
  }

  animo.prototype = {

    // A standard CSS animation
    init: function(callback) {
      
      var $me = this;

      // Are we stacking animations?
      if(Object.prototype.toString.call( $me.options.animation ) === '[object Array]') {
        $.merge($me.queue, $me.options.animation);
      } else {
        $me.queue.push($me.options.animation);
      }

      $me.cleanse();

      $me.animate(callback);
      
    },

    // The actual adding of the class and listening for completion
    animate: function(callback) {

      this.element.addClass('animated');

      this.element.addClass(this.queue[0]);

      this.element.data("animo", this.queue[0]);

      var ai = this.prefixes.length;

      // Add the options for each prefix
      while(ai--) {

        this.element.css(this.prefixes[ai]+"animation-duration", this.options.duration+"s");

        this.element.css(this.prefixes[ai]+"animation-iteration-count", this.options.iterate);

        this.element.css(this.prefixes[ai]+"animation-timing-function", this.options.timing);

      }

      var $me = this, _cb = callback;

      if($me.queue.length>1) {
        _cb = null;
      }

      // Listen for the end of the animation
      this._end("AnimationEnd", function() {

        // If there are more, clean it up and move on
        if($me.element.hasClass($me.queue[0])) {

          if(!$me.options.keep) {
            $me.cleanse();
          }

          $me.queue.shift();

          if($me.queue.length) {

            $me.animate(callback);
          }
        }
      }, _cb);
    },

    cleanse: function() {

      this.element.removeClass('animated');

      this.element.removeClass(this.queue[0]);

      this.element.removeClass(this.element.data("animo"));

      var ai = this.prefixes.length;

      while(ai--) {

        this.element.css(this.prefixes[ai]+"animation-duration", "");

        this.element.css(this.prefixes[ai]+"animation-iteration-count", "");

        this.element.css(this.prefixes[ai]+"animation-timing-function", "");

        this.element.css(this.prefixes[ai]+"transition", "");

        this.element.css(this.prefixes[ai]+"transform", "");

        this.element.css(this.prefixes[ai]+"filter", "");

      }
    },

    _blur: function(callback) {

      if(this.element.is("img")) {

        var svg_id = "svg_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
        var filter_id = "filter_" + (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);

        $('body').append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="'+svg_id+'" style="height:0;position:absolute;top:-1000px;"><filter id="'+filter_id+'"><feGaussianBlur stdDeviation="'+this.options.amount+'" /></filter></svg>');

        var ai = this.prefixes.length;

        while(ai--) {

          this.element.css(this.prefixes[ai]+"filter", "blur("+this.options.amount+"px)");

          this.element.css(this.prefixes[ai]+"transition", this.options.duration+"s all linear");

        }

        this.element.css("filter", "url(#"+filter_id+")");

        this.element.data("svgid", svg_id);
      
      } else {

        var color = this.element.css('color');

        var ai = this.prefixes.length;

        // Add the options for each prefix
        while(ai--) {

          this.element.css(this.prefixes[ai]+"transition", "all "+this.options.duration+"s linear");

        }

        this.element.css("text-shadow", "0 0 "+this.options.amount+"px "+color);
        this.element.css("color", "transparent");
      }

      this._end("TransitionEnd", null, callback);

      var $me = this;

      if(this.options.focusAfter) {

        var focus_wait = window.setTimeout(function() {

          $me._focus();

          focus_wait = window.clearTimeout(focus_wait);

        }, (this.options.focusAfter*1000));
      }

    },

    _focus: function() {

      var ai = this.prefixes.length;

      if(this.element.is("img")) {

        while(ai--) {

          this.element.css(this.prefixes[ai]+"filter", "");

          this.element.css(this.prefixes[ai]+"transition", "");

        }

        var $svg = $('#'+this.element.data('svgid'));

        $svg.remove();
      } else {

        while(ai--) {

          this.element.css(this.prefixes[ai]+"transition", "");

        }

        this.element.css("text-shadow", "");
        this.element.css("color", "");
      }
    },

    _rotate: function(callback) {

      var ai = this.prefixes.length;

      // Add the options for each prefix
      while(ai--) {

        this.element.css(this.prefixes[ai]+"transition", "all "+this.options.duration+"s linear");

        this.element.css(this.prefixes[ai]+"transform", "rotate("+this.options.degrees+"deg)");

      }

      this._end("TransitionEnd", null, callback);

    },

    _end: function(type, todo, callback) {

      var $me = this;

      var binding = type.toLowerCase()+" webkit"+type+" o"+type+" MS"+type;

      this.element.bind(binding, function() {
        
        $me.element.unbind(binding);

        if(typeof todo == "function") {

          todo();
        }

        if(typeof callback == "function") {

          callback($me);
        }
      });
      
    }
  };

  $.fn.animo = function ( options, callback, other_cb ) {
    
    return this.each(function() {
      
      new animo( this, options, callback, other_cb );

    });

  };

})( jQuery, window, document );
//Paul Irish's requestAnimFrame
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


//better setInterval
window.requestInterval = function(fn, delay) {
    if( !window.requestAnimationFrame       && 
        !window.webkitRequestAnimationFrame && 
        !window.mozRequestAnimationFrame    && 
        !window.oRequestAnimationFrame      && 
        !window.msRequestAnimationFrame)
            return window.setInterval(fn, delay);

    var start = new Date().getTime(),
    handle = new Object();

    function loop() {
        var current = new Date().getTime(),
        delta = current - start;

        if(delta >= delay) {
            fn.call();
            start = new Date().getTime();
        }

        handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
}

window.clearRequestInterval = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value)   :
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
};

//better setTimeout

window.requestTimeout = function(fn, delay) {
    if( !window.requestAnimationFrame       && 
        !window.webkitRequestAnimationFrame && 
        !window.mozRequestAnimationFrame    && 
        !window.oRequestAnimationFrame      && 
        !window.msRequestAnimationFrame)
            return window.setTimeout(fn, delay);

    var start = new Date().getTime(),
        handle = new Object();

    function loop(){
        var current = new Date().getTime(),
        delta = current - start;

        delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
    };

    handle.value = requestAnimFrame(loop);
    return handle;
};

window.clearRequestTimeout = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value)   :
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
};
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */


( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );
/*
 * jQuery Currency v0.5
 * Simple, unobtrusive currency converting and formatting
 *
 * Copyright 2011, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * http://dev7studios.com
 */


(function($) {

    $.fn.currency = function(method) {

        var methods = {

            init : function(options) {
                var settings = $.extend({}, this.currency.defaults, options);
                return this.each(function() {
                    var $element = $(this),
                         element = this;
                    var value = 0;
                    
                    if($element.is(':input')){
                        value = $element.val();
                    } else {
                        value = $element.text();
                    }
                    
                    if(helpers.isNumber(value)){
                    
                        if(settings.convertFrom != ''){
                            if($element.is(':input')){
                                $element.val(value +' '+ settings.convertLoading);
                            } else {
                                $element.html(value +' '+ settings.convertLoading);
                            }
                            $.post(settings.convertLocation, { amount: value, from: settings.convertFrom, to: settings.region }, function(data){
                                value = data;
                                if($element.is(':input')){
                                    $element.val(helpers.format_currency(value, settings));
                                } else {
                                    $element.html(helpers.format_currency(value, settings));
                                }
                            });
                        } else {
                            if($element.is(':input')){
                                $element.val(helpers.format_currency(value, settings));
                            } else {
                                $element.html(helpers.format_currency(value, settings));
                            }
                        }
                    
                    }
                    
                });

            },

        }

        var helpers = {

            format_currency: function(amount, settings) {
                var bc = settings.region;
                var currency_before = '';
                var currency_after = '';
                
                if(bc == 'ALL') currency_before = 'Lek';
                if(bc == 'ARS') currency_before = '$';
                if(bc == 'AWG') currency_before = 'f';
                if(bc == 'AUD') currency_before = '$';
                if(bc == 'BSD') currency_before = '$';
                if(bc == 'BBD') currency_before = '$';
                if(bc == 'BYR') currency_before = 'p.';
                if(bc == 'BZD') currency_before = 'BZ$';
                if(bc == 'BMD') currency_before = '$';
                if(bc == 'BOB') currency_before = '$b';
                if(bc == 'BAM') currency_before = 'KM';
                if(bc == 'BWP') currency_before = 'P';
                if(bc == 'BRL') currency_before = 'R$';
                if(bc == 'BND') currency_before = '$';
                if(bc == 'CAD') currency_before = '$';
                if(bc == 'KYD') currency_before = '$';
                if(bc == 'CLP') currency_before = '$';
                if(bc == 'CNY') currency_before = '&yen;';
                if(bc == 'COP') currency_before = '$';
                if(bc == 'CRC') currency_before = 'c';
                if(bc == 'HRK') currency_before = 'kn';
                if(bc == 'CZK') currency_before = 'Kc';
                if(bc == 'DKK') currency_before = 'kr';
                if(bc == 'DOP') currency_before = 'RD$';
                if(bc == 'XCD') currency_before = '$';
                if(bc == 'EGP') currency_before = '&pound;';
                if(bc == 'SVC') currency_before = '$';
                if(bc == 'EEK') currency_before = 'kr';
                if(bc == 'EUR') currency_before = '&euro;';
                if(bc == 'FKP') currency_before = '&pound;';
                if(bc == 'FJD') currency_before = '$';
                if(bc == 'GBP') currency_before = '&pound;';
                if(bc == 'GHC') currency_before = 'c';
                if(bc == 'GIP') currency_before = '&pound;';
                if(bc == 'GTQ') currency_before = 'Q';
                if(bc == 'GGP') currency_before = '&pound;';
                if(bc == 'GYD') currency_before = '$';
                if(bc == 'HNL') currency_before = 'L';
                if(bc == 'HKD') currency_before = '$';
                if(bc == 'HUF') currency_before = 'Ft';
                if(bc == 'ISK') currency_before = 'kr';
                if(bc == 'IDR') currency_before = 'Rp';
                if(bc == 'IMP') currency_before = '&pound;';
                if(bc == 'JMD') currency_before = 'J$';
                if(bc == 'JPY') currency_before = '&yen;';
                if(bc == 'JEP') currency_before = '&pound;';
                if(bc == 'LVL') currency_before = 'Ls';
                if(bc == 'LBP') currency_before = '&pound;';
                if(bc == 'LRD') currency_before = '$';
                if(bc == 'LTL') currency_before = 'Lt';
                if(bc == 'MYR') currency_before = 'RM';
                if(bc == 'MXN') currency_before = '$';
                if(bc == 'MZN') currency_before = 'MT';
                if(bc == 'NAD') currency_before = '$';
                if(bc == 'ANG') currency_before = 'f';
                if(bc == 'NZD') currency_before = '$';
                if(bc == 'NIO') currency_before = 'C$';
                if(bc == 'NOK') currency_before = 'kr';
                if(bc == 'PAB') currency_before = 'B/.';
                if(bc == 'PYG') currency_before = 'Gs';
                if(bc == 'PEN') currency_before = 'S/.';
                if(bc == 'PLN') currency_before = 'zl';
                if(bc == 'RON') currency_before = 'lei';
                if(bc == 'SHP') currency_before = '&pound;';
                if(bc == 'SGD') currency_before = '$';
                if(bc == 'SBD') currency_before = '$';
                if(bc == 'SOS') currency_before = 'S';
                if(bc == 'ZAR') currency_before = 'R';
                if(bc == 'SEK') currency_before = 'kr';
                if(bc == 'CHF') currency_before = 'CHF';
                if(bc == 'SRD') currency_before = '$';
                if(bc == 'SYP') currency_before = '&pound;';
                if(bc == 'TWD') currency_before = 'NT$';
                if(bc == 'TTD') currency_before = 'TT$';
                if(bc == 'TRY') currency_before = 'TL';
                if(bc == 'TRL') currency_before = '&pound;';
                if(bc == 'TVD') currency_before = '$';
                if(bc == 'GBP') currency_before = '&pound;';
                if(bc == 'USD') currency_before = '$';
                if(bc == 'UYU') currency_before = '$U';
                if(bc == 'VEF') currency_before = 'Bs';
                if(bc == 'ZWD') currency_before = 'Z$';
                
                if( currency_before == '' && currency_after == '' ) currency_before = '$';
                
                var output = '';
                if(!settings.hidePrefix) output += currency_before;
                output += helpers.number_format( amount, settings.decimals, settings.decimal, settings.thousands );
                if(!settings.hidePostfix) output += currency_after;
                return output;
            },
            
            // Kindly borrowed from http://phpjs.org/functions/number_format
            number_format: function(number, decimals, dec_point, thousands_sep) {
                number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
                var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                    s = '',
                    toFixedFix = function (n, prec) {
                        var k = Math.pow(10, prec);
                        return '' + Math.round(n * k) / k;
                    };
                // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                if (s[0].length > 3) {
                    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                }
                if ((s[1] || '').length < prec) {
                    s[1] = s[1] || '';
                    s[1] += new Array(prec - s[1].length + 1).join('0');
                }
                return s.join(dec);
            },
            
            isNumber: function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
            
        }

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error( 'Method "' +  method + '" does not exist in currency plugin!');
        }

    }

    $.fn.currency.defaults = {
        region: 'GBP', // The 3 digit ISO code you want to display your currency in
        thousands: ',', // Thousands separator
        decimal: '.',   // Decimal separator
        decimals: 0, // How many decimals to show
        hidePrefix: false, // Hide any prefix
        hidePostfix: false, // Hide any postfix
        convertFrom: '', // If converting, the 3 digit ISO code you want to convert from,
        convertLoading: '(Converting...)', // Loading message appended to values while converting
        convertLocation: 'convert.php' // Location of convert.php file
    }

    $.fn.currency.settings = {}

})(jQuery);
/*
 * File:        jquery.dataTables.min.js
 * Version:     1.9.4
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * Info:        www.datatables.net
 * 
 * Copyright 2008-2012 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */

(function(X,l,n){var L=function(h){var j=function(e){function o(a,b){var c=j.defaults.columns,d=a.aoColumns.length,c=h.extend({},j.models.oColumn,c,{sSortingClass:a.oClasses.sSortable,sSortingClassJUI:a.oClasses.sSortJUI,nTh:b?b:l.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.oDefaults:d});a.aoColumns.push(c);if(a.aoPreSearchCols[d]===n||null===a.aoPreSearchCols[d])a.aoPreSearchCols[d]=h.extend({},j.models.oSearch);else if(c=a.aoPreSearchCols[d],
c.bRegex===n&&(c.bRegex=!0),c.bSmart===n&&(c.bSmart=!0),c.bCaseInsensitive===n)c.bCaseInsensitive=!0;m(a,d,null)}function m(a,b,c){var d=a.aoColumns[b];c!==n&&null!==c&&(c.mDataProp&&!c.mData&&(c.mData=c.mDataProp),c.sType!==n&&(d.sType=c.sType,d._bAutoType=!1),h.extend(d,c),p(d,c,"sWidth","sWidthOrig"),c.iDataSort!==n&&(d.aDataSort=[c.iDataSort]),p(d,c,"aDataSort"));var i=d.mRender?Q(d.mRender):null,f=Q(d.mData);d.fnGetData=function(a,b){var c=f(a,b);return d.mRender&&b&&""!==b?i(c,b,a):c};d.fnSetData=
L(d.mData);a.oFeatures.bSort||(d.bSortable=!1);!d.bSortable||-1==h.inArray("asc",d.asSorting)&&-1==h.inArray("desc",d.asSorting)?(d.sSortingClass=a.oClasses.sSortableNone,d.sSortingClassJUI=""):-1==h.inArray("asc",d.asSorting)&&-1==h.inArray("desc",d.asSorting)?(d.sSortingClass=a.oClasses.sSortable,d.sSortingClassJUI=a.oClasses.sSortJUI):-1!=h.inArray("asc",d.asSorting)&&-1==h.inArray("desc",d.asSorting)?(d.sSortingClass=a.oClasses.sSortableAsc,d.sSortingClassJUI=a.oClasses.sSortJUIAscAllowed):-1==
h.inArray("asc",d.asSorting)&&-1!=h.inArray("desc",d.asSorting)&&(d.sSortingClass=a.oClasses.sSortableDesc,d.sSortingClassJUI=a.oClasses.sSortJUIDescAllowed)}function k(a){if(!1===a.oFeatures.bAutoWidth)return!1;da(a);for(var b=0,c=a.aoColumns.length;b<c;b++)a.aoColumns[b].nTh.style.width=a.aoColumns[b].sWidth}function G(a,b){var c=r(a,"bVisible");return"number"===typeof c[b]?c[b]:null}function R(a,b){var c=r(a,"bVisible"),c=h.inArray(b,c);return-1!==c?c:null}function t(a){return r(a,"bVisible").length}
function r(a,b){var c=[];h.map(a.aoColumns,function(a,i){a[b]&&c.push(i)});return c}function B(a){for(var b=j.ext.aTypes,c=b.length,d=0;d<c;d++){var i=b[d](a);if(null!==i)return i}return"string"}function u(a,b){for(var c=b.split(","),d=[],i=0,f=a.aoColumns.length;i<f;i++)for(var g=0;g<f;g++)if(a.aoColumns[i].sName==c[g]){d.push(g);break}return d}function M(a){for(var b="",c=0,d=a.aoColumns.length;c<d;c++)b+=a.aoColumns[c].sName+",";return b.length==d?"":b.slice(0,-1)}function ta(a,b,c,d){var i,f,
g,e,w;if(b)for(i=b.length-1;0<=i;i--){var j=b[i].aTargets;h.isArray(j)||D(a,1,"aTargets must be an array of targets, not a "+typeof j);f=0;for(g=j.length;f<g;f++)if("number"===typeof j[f]&&0<=j[f]){for(;a.aoColumns.length<=j[f];)o(a);d(j[f],b[i])}else if("number"===typeof j[f]&&0>j[f])d(a.aoColumns.length+j[f],b[i]);else if("string"===typeof j[f]){e=0;for(w=a.aoColumns.length;e<w;e++)("_all"==j[f]||h(a.aoColumns[e].nTh).hasClass(j[f]))&&d(e,b[i])}}if(c){i=0;for(a=c.length;i<a;i++)d(i,c[i])}}function H(a,
b){var c;c=h.isArray(b)?b.slice():h.extend(!0,{},b);var d=a.aoData.length,i=h.extend(!0,{},j.models.oRow);i._aData=c;a.aoData.push(i);for(var f,i=0,g=a.aoColumns.length;i<g;i++)c=a.aoColumns[i],"function"===typeof c.fnRender&&c.bUseRendered&&null!==c.mData?F(a,d,i,S(a,d,i)):F(a,d,i,v(a,d,i)),c._bAutoType&&"string"!=c.sType&&(f=v(a,d,i,"type"),null!==f&&""!==f&&(f=B(f),null===c.sType?c.sType=f:c.sType!=f&&"html"!=c.sType&&(c.sType="string")));a.aiDisplayMaster.push(d);a.oFeatures.bDeferRender||ea(a,
d);return d}function ua(a){var b,c,d,i,f,g,e;if(a.bDeferLoading||null===a.sAjaxSource)for(b=a.nTBody.firstChild;b;){if("TR"==b.nodeName.toUpperCase()){c=a.aoData.length;b._DT_RowIndex=c;a.aoData.push(h.extend(!0,{},j.models.oRow,{nTr:b}));a.aiDisplayMaster.push(c);f=b.firstChild;for(d=0;f;){g=f.nodeName.toUpperCase();if("TD"==g||"TH"==g)F(a,c,d,h.trim(f.innerHTML)),d++;f=f.nextSibling}}b=b.nextSibling}i=T(a);d=[];b=0;for(c=i.length;b<c;b++)for(f=i[b].firstChild;f;)g=f.nodeName.toUpperCase(),("TD"==
g||"TH"==g)&&d.push(f),f=f.nextSibling;c=0;for(i=a.aoColumns.length;c<i;c++){e=a.aoColumns[c];null===e.sTitle&&(e.sTitle=e.nTh.innerHTML);var w=e._bAutoType,o="function"===typeof e.fnRender,k=null!==e.sClass,n=e.bVisible,m,p;if(w||o||k||!n){g=0;for(b=a.aoData.length;g<b;g++)f=a.aoData[g],m=d[g*i+c],w&&"string"!=e.sType&&(p=v(a,g,c,"type"),""!==p&&(p=B(p),null===e.sType?e.sType=p:e.sType!=p&&"html"!=e.sType&&(e.sType="string"))),e.mRender?m.innerHTML=v(a,g,c,"display"):e.mData!==c&&(m.innerHTML=v(a,
g,c,"display")),o&&(p=S(a,g,c),m.innerHTML=p,e.bUseRendered&&F(a,g,c,p)),k&&(m.className+=" "+e.sClass),n?f._anHidden[c]=null:(f._anHidden[c]=m,m.parentNode.removeChild(m)),e.fnCreatedCell&&e.fnCreatedCell.call(a.oInstance,m,v(a,g,c,"display"),f._aData,g,c)}}if(0!==a.aoRowCreatedCallback.length){b=0;for(c=a.aoData.length;b<c;b++)f=a.aoData[b],A(a,"aoRowCreatedCallback",null,[f.nTr,f._aData,b])}}function I(a,b){return b._DT_RowIndex!==n?b._DT_RowIndex:null}function fa(a,b,c){for(var b=J(a,b),d=0,a=
a.aoColumns.length;d<a;d++)if(b[d]===c)return d;return-1}function Y(a,b,c,d){for(var i=[],f=0,g=d.length;f<g;f++)i.push(v(a,b,d[f],c));return i}function v(a,b,c,d){var i=a.aoColumns[c];if((c=i.fnGetData(a.aoData[b]._aData,d))===n)return a.iDrawError!=a.iDraw&&null===i.sDefaultContent&&(D(a,0,"Requested unknown parameter "+("function"==typeof i.mData?"{mData function}":"'"+i.mData+"'")+" from the data source for row "+b),a.iDrawError=a.iDraw),i.sDefaultContent;if(null===c&&null!==i.sDefaultContent)c=
i.sDefaultContent;else if("function"===typeof c)return c();return"display"==d&&null===c?"":c}function F(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d)}function Q(a){if(null===a)return function(){return null};if("function"===typeof a)return function(b,d,i){return a(b,d,i)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("["))){var b=function(a,d,i){var f=i.split("."),g;if(""!==i){var e=0;for(g=f.length;e<g;e++){if(i=f[e].match(U)){f[e]=f[e].replace(U,"");""!==f[e]&&(a=a[f[e]]);
g=[];f.splice(0,e+1);for(var f=f.join("."),e=0,h=a.length;e<h;e++)g.push(b(a[e],d,f));a=i[0].substring(1,i[0].length-1);a=""===a?g:g.join(a);break}if(null===a||a[f[e]]===n)return n;a=a[f[e]]}}return a};return function(c,d){return b(c,d,a)}}return function(b){return b[a]}}function L(a){if(null===a)return function(){};if("function"===typeof a)return function(b,d){a(b,"set",d)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("["))){var b=function(a,d,i){var i=i.split("."),f,g,e=0;for(g=
i.length-1;e<g;e++){if(f=i[e].match(U)){i[e]=i[e].replace(U,"");a[i[e]]=[];f=i.slice();f.splice(0,e+1);g=f.join(".");for(var h=0,j=d.length;h<j;h++)f={},b(f,d[h],g),a[i[e]].push(f);return}if(null===a[i[e]]||a[i[e]]===n)a[i[e]]={};a=a[i[e]]}a[i[i.length-1].replace(U,"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Z(a){for(var b=[],c=a.aoData.length,d=0;d<c;d++)b.push(a.aoData[d]._aData);return b}function ga(a){a.aoData.splice(0,a.aoData.length);a.aiDisplayMaster.splice(0,
a.aiDisplayMaster.length);a.aiDisplay.splice(0,a.aiDisplay.length);y(a)}function ha(a,b){for(var c=-1,d=0,i=a.length;d<i;d++)a[d]==b?c=d:a[d]>b&&a[d]--; -1!=c&&a.splice(c,1)}function S(a,b,c){var d=a.aoColumns[c];return d.fnRender({iDataRow:b,iDataColumn:c,oSettings:a,aData:a.aoData[b]._aData,mDataProp:d.mData},v(a,b,c,"display"))}function ea(a,b){var c=a.aoData[b],d;if(null===c.nTr){c.nTr=l.createElement("tr");c.nTr._DT_RowIndex=b;c._aData.DT_RowId&&(c.nTr.id=c._aData.DT_RowId);c._aData.DT_RowClass&&
(c.nTr.className=c._aData.DT_RowClass);for(var i=0,f=a.aoColumns.length;i<f;i++){var g=a.aoColumns[i];d=l.createElement(g.sCellType);d.innerHTML="function"===typeof g.fnRender&&(!g.bUseRendered||null===g.mData)?S(a,b,i):v(a,b,i,"display");null!==g.sClass&&(d.className=g.sClass);g.bVisible?(c.nTr.appendChild(d),c._anHidden[i]=null):c._anHidden[i]=d;g.fnCreatedCell&&g.fnCreatedCell.call(a.oInstance,d,v(a,b,i,"display"),c._aData,b,i)}A(a,"aoRowCreatedCallback",null,[c.nTr,c._aData,b])}}function va(a){var b,
c,d;if(0!==h("th, td",a.nTHead).length){b=0;for(d=a.aoColumns.length;b<d;b++)if(c=a.aoColumns[b].nTh,c.setAttribute("role","columnheader"),a.aoColumns[b].bSortable&&(c.setAttribute("tabindex",a.iTabIndex),c.setAttribute("aria-controls",a.sTableId)),null!==a.aoColumns[b].sClass&&h(c).addClass(a.aoColumns[b].sClass),a.aoColumns[b].sTitle!=c.innerHTML)c.innerHTML=a.aoColumns[b].sTitle}else{var i=l.createElement("tr");b=0;for(d=a.aoColumns.length;b<d;b++)c=a.aoColumns[b].nTh,c.innerHTML=a.aoColumns[b].sTitle,
c.setAttribute("tabindex","0"),null!==a.aoColumns[b].sClass&&h(c).addClass(a.aoColumns[b].sClass),i.appendChild(c);h(a.nTHead).html("")[0].appendChild(i);V(a.aoHeader,a.nTHead)}h(a.nTHead).children("tr").attr("role","row");if(a.bJUI){b=0;for(d=a.aoColumns.length;b<d;b++){c=a.aoColumns[b].nTh;i=l.createElement("div");i.className=a.oClasses.sSortJUIWrapper;h(c).contents().appendTo(i);var f=l.createElement("span");f.className=a.oClasses.sSortIcon;i.appendChild(f);c.appendChild(i)}}if(a.oFeatures.bSort)for(b=
0;b<a.aoColumns.length;b++)!1!==a.aoColumns[b].bSortable?ia(a,a.aoColumns[b].nTh,b):h(a.aoColumns[b].nTh).addClass(a.oClasses.sSortableNone);""!==a.oClasses.sFooterTH&&h(a.nTFoot).children("tr").children("th").addClass(a.oClasses.sFooterTH);if(null!==a.nTFoot){c=N(a,null,a.aoFooter);b=0;for(d=a.aoColumns.length;b<d;b++)c[b]&&(a.aoColumns[b].nTf=c[b],a.aoColumns[b].sClass&&h(c[b]).addClass(a.aoColumns[b].sClass))}}function W(a,b,c){var d,i,f,g=[],e=[],h=a.aoColumns.length,j;c===n&&(c=!1);d=0;for(i=
b.length;d<i;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=h-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);e.push([])}d=0;for(i=g.length;d<i;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(j=h=1,e[d][f]===n){a.appendChild(g[d][f].cell);for(e[d][f]=1;g[d+h]!==n&&g[d][f].cell==g[d+h][f].cell;)e[d+h][f]=1,h++;for(;g[d][f+j]!==n&&g[d][f].cell==g[d][f+j].cell;){for(c=0;c<h;c++)e[d+c][f+j]=1;j++}g[d][f].cell.rowSpan=h;g[d][f].cell.colSpan=j}}}function x(a){var b=
A(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,b))E(a,!1);else{var c,d,b=[],i=0,f=a.asStripeClasses.length;c=a.aoOpenRows.length;a.bDrawing=!0;a.iInitDisplayStart!==n&&-1!=a.iInitDisplayStart&&(a._iDisplayStart=a.oFeatures.bServerSide?a.iInitDisplayStart:a.iInitDisplayStart>=a.fnRecordsDisplay()?0:a.iInitDisplayStart,a.iInitDisplayStart=-1,y(a));if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++;else if(a.oFeatures.bServerSide){if(!a.bDestroying&&!wa(a))return}else a.iDraw++;if(0!==a.aiDisplay.length){var g=
a._iDisplayStart;d=a._iDisplayEnd;a.oFeatures.bServerSide&&(g=0,d=a.aoData.length);for(;g<d;g++){var e=a.aoData[a.aiDisplay[g]];null===e.nTr&&ea(a,a.aiDisplay[g]);var j=e.nTr;if(0!==f){var o=a.asStripeClasses[i%f];e._sRowStripe!=o&&(h(j).removeClass(e._sRowStripe).addClass(o),e._sRowStripe=o)}A(a,"aoRowCallback",null,[j,a.aoData[a.aiDisplay[g]]._aData,i,g]);b.push(j);i++;if(0!==c)for(e=0;e<c;e++)if(j==a.aoOpenRows[e].nParent){b.push(a.aoOpenRows[e].nTr);break}}}else b[0]=l.createElement("tr"),a.asStripeClasses[0]&&
(b[0].className=a.asStripeClasses[0]),c=a.oLanguage,f=c.sZeroRecords,1==a.iDraw&&null!==a.sAjaxSource&&!a.oFeatures.bServerSide?f=c.sLoadingRecords:c.sEmptyTable&&0===a.fnRecordsTotal()&&(f=c.sEmptyTable),c=l.createElement("td"),c.setAttribute("valign","top"),c.colSpan=t(a),c.className=a.oClasses.sRowEmpty,c.innerHTML=ja(a,f),b[i].appendChild(c);A(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Z(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);A(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],
Z(a),a._iDisplayStart,a.fnDisplayEnd(),a.aiDisplay]);i=l.createDocumentFragment();c=l.createDocumentFragment();if(a.nTBody){f=a.nTBody.parentNode;c.appendChild(a.nTBody);if(!a.oScroll.bInfinite||!a._bInitComplete||a.bSorted||a.bFiltered)for(;c=a.nTBody.firstChild;)a.nTBody.removeChild(c);c=0;for(d=b.length;c<d;c++)i.appendChild(b[c]);a.nTBody.appendChild(i);null!==f&&f.appendChild(a.nTBody)}A(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1;a.oFeatures.bServerSide&&(E(a,!1),
a._bInitComplete||$(a))}}function aa(a){a.oFeatures.bSort?O(a,a.oPreviousSearch):a.oFeatures.bFilter?K(a,a.oPreviousSearch):(y(a),x(a))}function xa(a){var b=h("<div></div>")[0];a.nTable.parentNode.insertBefore(b,a.nTable);a.nTableWrapper=h('<div id="'+a.sTableId+'_wrapper" class="'+a.oClasses.sWrapper+'" role="grid"></div>')[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var c=a.nTableWrapper,d=a.sDom.split(""),i,f,g,e,w,o,k,m=0;m<d.length;m++){f=0;g=d[m];if("<"==g){e=h("<div></div>")[0];w=d[m+
1];if("'"==w||'"'==w){o="";for(k=2;d[m+k]!=w;)o+=d[m+k],k++;"H"==o?o=a.oClasses.sJUIHeader:"F"==o&&(o=a.oClasses.sJUIFooter);-1!=o.indexOf(".")?(w=o.split("."),e.id=w[0].substr(1,w[0].length-1),e.className=w[1]):"#"==o.charAt(0)?e.id=o.substr(1,o.length-1):e.className=o;m+=k}c.appendChild(e);c=e}else if(">"==g)c=c.parentNode;else if("l"==g&&a.oFeatures.bPaginate&&a.oFeatures.bLengthChange)i=ya(a),f=1;else if("f"==g&&a.oFeatures.bFilter)i=za(a),f=1;else if("r"==g&&a.oFeatures.bProcessing)i=Aa(a),f=
1;else if("t"==g)i=Ba(a),f=1;else if("i"==g&&a.oFeatures.bInfo)i=Ca(a),f=1;else if("p"==g&&a.oFeatures.bPaginate)i=Da(a),f=1;else if(0!==j.ext.aoFeatures.length){e=j.ext.aoFeatures;k=0;for(w=e.length;k<w;k++)if(g==e[k].cFeature){(i=e[k].fnInit(a))&&(f=1);break}}1==f&&null!==i&&("object"!==typeof a.aanFeatures[g]&&(a.aanFeatures[g]=[]),a.aanFeatures[g].push(i),c.appendChild(i))}b.parentNode.replaceChild(a.nTableWrapper,b)}function V(a,b){var c=h(b).children("tr"),d,i,f,g,e,j,o,k,m,p;a.splice(0,a.length);
f=0;for(j=c.length;f<j;f++)a.push([]);f=0;for(j=c.length;f<j;f++){d=c[f];for(i=d.firstChild;i;){if("TD"==i.nodeName.toUpperCase()||"TH"==i.nodeName.toUpperCase()){k=1*i.getAttribute("colspan");m=1*i.getAttribute("rowspan");k=!k||0===k||1===k?1:k;m=!m||0===m||1===m?1:m;g=0;for(e=a[f];e[g];)g++;o=g;p=1===k?!0:!1;for(e=0;e<k;e++)for(g=0;g<m;g++)a[f+g][o+e]={cell:i,unique:p},a[f+g].nTr=d}i=i.nextSibling}}}function N(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],V(c,b)));for(var b=0,i=c.length;b<i;b++)for(var f=
0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function wa(a){if(a.bAjaxDataGet){a.iDraw++;E(a,!0);var b=Ea(a);ka(a,b);a.fnServerData.call(a.oInstance,a.sAjaxSource,b,function(b){Fa(a,b)},a);return!1}return!0}function Ea(a){var b=a.aoColumns.length,c=[],d,i,f,g;c.push({name:"sEcho",value:a.iDraw});c.push({name:"iColumns",value:b});c.push({name:"sColumns",value:M(a)});c.push({name:"iDisplayStart",value:a._iDisplayStart});c.push({name:"iDisplayLength",
value:!1!==a.oFeatures.bPaginate?a._iDisplayLength:-1});for(f=0;f<b;f++)d=a.aoColumns[f].mData,c.push({name:"mDataProp_"+f,value:"function"===typeof d?"function":d});if(!1!==a.oFeatures.bFilter){c.push({name:"sSearch",value:a.oPreviousSearch.sSearch});c.push({name:"bRegex",value:a.oPreviousSearch.bRegex});for(f=0;f<b;f++)c.push({name:"sSearch_"+f,value:a.aoPreSearchCols[f].sSearch}),c.push({name:"bRegex_"+f,value:a.aoPreSearchCols[f].bRegex}),c.push({name:"bSearchable_"+f,value:a.aoColumns[f].bSearchable})}if(!1!==
a.oFeatures.bSort){var e=0;d=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(f=0;f<d.length;f++){i=a.aoColumns[d[f][0]].aDataSort;for(g=0;g<i.length;g++)c.push({name:"iSortCol_"+e,value:i[g]}),c.push({name:"sSortDir_"+e,value:d[f][1]}),e++}c.push({name:"iSortingCols",value:e});for(f=0;f<b;f++)c.push({name:"bSortable_"+f,value:a.aoColumns[f].bSortable})}return c}function ka(a,b){A(a,"aoServerParams","serverParams",[b])}function Fa(a,b){if(b.sEcho!==n){if(1*b.sEcho<
a.iDraw)return;a.iDraw=1*b.sEcho}(!a.oScroll.bInfinite||a.oScroll.bInfinite&&(a.bSorted||a.bFiltered))&&ga(a);a._iRecordsTotal=parseInt(b.iTotalRecords,10);a._iRecordsDisplay=parseInt(b.iTotalDisplayRecords,10);var c=M(a),c=b.sColumns!==n&&""!==c&&b.sColumns!=c,d;c&&(d=u(a,b.sColumns));for(var i=Q(a.sAjaxDataProp)(b),f=0,g=i.length;f<g;f++)if(c){for(var e=[],h=0,j=a.aoColumns.length;h<j;h++)e.push(i[f][d[h]]);H(a,e)}else H(a,i[f]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;x(a);a.bAjaxDataGet=
!0;E(a,!1)}function za(a){var b=a.oPreviousSearch,c=a.oLanguage.sSearch,c=-1!==c.indexOf("_INPUT_")?c.replace("_INPUT_",'<input type="text" />'):""===c?'<input type="text" />':c+' <input type="text" />',d=l.createElement("div");d.className=a.oClasses.sFilter;d.innerHTML="<label>"+c+"</label>";a.aanFeatures.f||(d.id=a.sTableId+"_filter");c=h('input[type="text"]',d);d._DT_Input=c[0];c.val(b.sSearch.replace('"',"&quot;"));c.bind("keyup.DT",function(){for(var c=a.aanFeatures.f,d=this.value===""?"":this.value,
g=0,e=c.length;g<e;g++)c[g]!=h(this).parents("div.dataTables_filter")[0]&&h(c[g]._DT_Input).val(d);d!=b.sSearch&&K(a,{sSearch:d,bRegex:b.bRegex,bSmart:b.bSmart,bCaseInsensitive:b.bCaseInsensitive})});c.attr("aria-controls",a.sTableId).bind("keypress.DT",function(a){if(a.keyCode==13)return false});return d}function K(a,b,c){var d=a.oPreviousSearch,i=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};if(a.oFeatures.bServerSide)f(b);
else{Ga(a,b.sSearch,c,b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<a.aoPreSearchCols.length;b++)Ha(a,i[b].sSearch,b,i[b].bRegex,i[b].bSmart,i[b].bCaseInsensitive);Ia(a)}a.bFiltered=!0;h(a.oInstance).trigger("filter",a);a._iDisplayStart=0;y(a);x(a);la(a,0)}function Ia(a){for(var b=j.ext.afnFiltering,c=r(a,"bSearchable"),d=0,i=b.length;d<i;d++)for(var f=0,g=0,e=a.aiDisplay.length;g<e;g++){var h=a.aiDisplay[g-f];b[d](a,Y(a,h,"filter",c),h)||(a.aiDisplay.splice(g-f,1),f++)}}function Ha(a,b,c,
d,i,f){if(""!==b)for(var g=0,b=ma(b,d,i,f),d=a.aiDisplay.length-1;0<=d;d--)i=Ja(v(a,a.aiDisplay[d],c,"filter"),a.aoColumns[c].sType),b.test(i)||(a.aiDisplay.splice(d,1),g++)}function Ga(a,b,c,d,i,f){d=ma(b,d,i,f);i=a.oPreviousSearch;c||(c=0);0!==j.ext.afnFiltering.length&&(c=1);if(0>=b.length)a.aiDisplay.splice(0,a.aiDisplay.length),a.aiDisplay=a.aiDisplayMaster.slice();else if(a.aiDisplay.length==a.aiDisplayMaster.length||i.sSearch.length>b.length||1==c||0!==b.indexOf(i.sSearch)){a.aiDisplay.splice(0,
a.aiDisplay.length);la(a,1);for(b=0;b<a.aiDisplayMaster.length;b++)d.test(a.asDataSearch[b])&&a.aiDisplay.push(a.aiDisplayMaster[b])}else for(b=c=0;b<a.asDataSearch.length;b++)d.test(a.asDataSearch[b])||(a.aiDisplay.splice(b-c,1),c++)}function la(a,b){if(!a.oFeatures.bServerSide){a.asDataSearch=[];for(var c=r(a,"bSearchable"),d=1===b?a.aiDisplayMaster:a.aiDisplay,i=0,f=d.length;i<f;i++)a.asDataSearch[i]=na(a,Y(a,d[i],"filter",c))}}function na(a,b){var c=b.join("  ");-1!==c.indexOf("&")&&(c=h("<div>").html(c).text());
return c.replace(/[\n\r]/g," ")}function ma(a,b,c,d){if(c)return a=b?a.split(" "):oa(a).split(" "),a="^(?=.*?"+a.join(")(?=.*?")+").*$",RegExp(a,d?"i":"");a=b?a:oa(a);return RegExp(a,d?"i":"")}function Ja(a,b){return"function"===typeof j.ext.ofnSearch[b]?j.ext.ofnSearch[b](a):null===a?"":"html"==b?a.replace(/[\r\n]/g," ").replace(/<.*?>/g,""):"string"===typeof a?a.replace(/[\r\n]/g," "):a}function oa(a){return a.replace(RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),
"\\$1")}function Ca(a){var b=l.createElement("div");b.className=a.oClasses.sInfo;a.aanFeatures.i||(a.aoDrawCallback.push({fn:Ka,sName:"information"}),b.id=a.sTableId+"_info");a.nTable.setAttribute("aria-describedby",a.sTableId+"_info");return b}function Ka(a){if(a.oFeatures.bInfo&&0!==a.aanFeatures.i.length){var b=a.oLanguage,c=a._iDisplayStart+1,d=a.fnDisplayEnd(),i=a.fnRecordsTotal(),f=a.fnRecordsDisplay(),g;g=0===f?b.sInfoEmpty:b.sInfo;f!=i&&(g+=" "+b.sInfoFiltered);g+=b.sInfoPostFix;g=ja(a,g);
null!==b.fnInfoCallback&&(g=b.fnInfoCallback.call(a.oInstance,a,c,d,i,f,g));a=a.aanFeatures.i;b=0;for(c=a.length;b<c;b++)h(a[b]).html(g)}}function ja(a,b){var c=a.fnFormatNumber(a._iDisplayStart+1),d=a.fnDisplayEnd(),d=a.fnFormatNumber(d),i=a.fnRecordsDisplay(),i=a.fnFormatNumber(i),f=a.fnRecordsTotal(),f=a.fnFormatNumber(f);a.oScroll.bInfinite&&(c=a.fnFormatNumber(1));return b.replace(/_START_/g,c).replace(/_END_/g,d).replace(/_TOTAL_/g,i).replace(/_MAX_/g,f)}function ba(a){var b,c,d=a.iInitDisplayStart;
if(!1===a.bInitialised)setTimeout(function(){ba(a)},200);else{xa(a);va(a);W(a,a.aoHeader);a.nTFoot&&W(a,a.aoFooter);E(a,!0);a.oFeatures.bAutoWidth&&da(a);b=0;for(c=a.aoColumns.length;b<c;b++)null!==a.aoColumns[b].sWidth&&(a.aoColumns[b].nTh.style.width=q(a.aoColumns[b].sWidth));a.oFeatures.bSort?O(a):a.oFeatures.bFilter?K(a,a.oPreviousSearch):(a.aiDisplay=a.aiDisplayMaster.slice(),y(a),x(a));null!==a.sAjaxSource&&!a.oFeatures.bServerSide?(c=[],ka(a,c),a.fnServerData.call(a.oInstance,a.sAjaxSource,
c,function(c){var f=a.sAjaxDataProp!==""?Q(a.sAjaxDataProp)(c):c;for(b=0;b<f.length;b++)H(a,f[b]);a.iInitDisplayStart=d;if(a.oFeatures.bSort)O(a);else{a.aiDisplay=a.aiDisplayMaster.slice();y(a);x(a)}E(a,false);$(a,c)},a)):a.oFeatures.bServerSide||(E(a,!1),$(a))}}function $(a,b){a._bInitComplete=!0;A(a,"aoInitComplete","init",[a,b])}function pa(a){var b=j.defaults.oLanguage;!a.sEmptyTable&&(a.sZeroRecords&&"No data available in table"===b.sEmptyTable)&&p(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&
(a.sZeroRecords&&"Loading..."===b.sLoadingRecords)&&p(a,a,"sZeroRecords","sLoadingRecords")}function ya(a){if(a.oScroll.bInfinite)return null;var b='<select size="1" '+('name="'+a.sTableId+'_length"')+">",c,d,i=a.aLengthMenu;if(2==i.length&&"object"===typeof i[0]&&"object"===typeof i[1]){c=0;for(d=i[0].length;c<d;c++)b+='<option value="'+i[0][c]+'">'+i[1][c]+"</option>"}else{c=0;for(d=i.length;c<d;c++)b+='<option value="'+i[c]+'">'+i[c]+"</option>"}b+="</select>";i=l.createElement("div");a.aanFeatures.l||
(i.id=a.sTableId+"_length");i.className=a.oClasses.sLength;i.innerHTML="<label>"+a.oLanguage.sLengthMenu.replace("_MENU_",b)+"</label>";h('select option[value="'+a._iDisplayLength+'"]',i).attr("selected",!0);h("select",i).bind("change.DT",function(){var b=h(this).val(),i=a.aanFeatures.l;c=0;for(d=i.length;c<d;c++)i[c]!=this.parentNode&&h("select",i[c]).val(b);a._iDisplayLength=parseInt(b,10);y(a);if(a.fnDisplayEnd()==a.fnRecordsDisplay()){a._iDisplayStart=a.fnDisplayEnd()-a._iDisplayLength;if(a._iDisplayStart<
0)a._iDisplayStart=0}if(a._iDisplayLength==-1)a._iDisplayStart=0;x(a)});h("select",i).attr("aria-controls",a.sTableId);return i}function y(a){a._iDisplayEnd=!1===a.oFeatures.bPaginate?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength>a.aiDisplay.length||-1==a._iDisplayLength?a.aiDisplay.length:a._iDisplayStart+a._iDisplayLength}function Da(a){if(a.oScroll.bInfinite)return null;var b=l.createElement("div");b.className=a.oClasses.sPaging+a.sPaginationType;j.ext.oPagination[a.sPaginationType].fnInit(a,
b,function(a){y(a);x(a)});a.aanFeatures.p||a.aoDrawCallback.push({fn:function(a){j.ext.oPagination[a.sPaginationType].fnUpdate(a,function(a){y(a);x(a)})},sName:"pagination"});return b}function qa(a,b){var c=a._iDisplayStart;if("number"===typeof b)a._iDisplayStart=b*a._iDisplayLength,a._iDisplayStart>a.fnRecordsDisplay()&&(a._iDisplayStart=0);else if("first"==b)a._iDisplayStart=0;else if("previous"==b)a._iDisplayStart=0<=a._iDisplayLength?a._iDisplayStart-a._iDisplayLength:0,0>a._iDisplayStart&&(a._iDisplayStart=
0);else if("next"==b)0<=a._iDisplayLength?a._iDisplayStart+a._iDisplayLength<a.fnRecordsDisplay()&&(a._iDisplayStart+=a._iDisplayLength):a._iDisplayStart=0;else if("last"==b)if(0<=a._iDisplayLength){var d=parseInt((a.fnRecordsDisplay()-1)/a._iDisplayLength,10)+1;a._iDisplayStart=(d-1)*a._iDisplayLength}else a._iDisplayStart=0;else D(a,0,"Unknown paging action: "+b);h(a.oInstance).trigger("page",a);return c!=a._iDisplayStart}function Aa(a){var b=l.createElement("div");a.aanFeatures.r||(b.id=a.sTableId+
"_processing");b.innerHTML=a.oLanguage.sProcessing;b.className=a.oClasses.sProcessing;a.nTable.parentNode.insertBefore(b,a.nTable);return b}function E(a,b){if(a.oFeatures.bProcessing)for(var c=a.aanFeatures.r,d=0,i=c.length;d<i;d++)c[d].style.visibility=b?"visible":"hidden";h(a.oInstance).trigger("processing",[a,b])}function Ba(a){if(""===a.oScroll.sX&&""===a.oScroll.sY)return a.nTable;var b=l.createElement("div"),c=l.createElement("div"),d=l.createElement("div"),i=l.createElement("div"),f=l.createElement("div"),
g=l.createElement("div"),e=a.nTable.cloneNode(!1),j=a.nTable.cloneNode(!1),o=a.nTable.getElementsByTagName("thead")[0],k=0===a.nTable.getElementsByTagName("tfoot").length?null:a.nTable.getElementsByTagName("tfoot")[0],m=a.oClasses;c.appendChild(d);f.appendChild(g);i.appendChild(a.nTable);b.appendChild(c);b.appendChild(i);d.appendChild(e);e.appendChild(o);null!==k&&(b.appendChild(f),g.appendChild(j),j.appendChild(k));b.className=m.sScrollWrapper;c.className=m.sScrollHead;d.className=m.sScrollHeadInner;
i.className=m.sScrollBody;f.className=m.sScrollFoot;g.className=m.sScrollFootInner;a.oScroll.bAutoCss&&(c.style.overflow="hidden",c.style.position="relative",f.style.overflow="hidden",i.style.overflow="auto");c.style.border="0";c.style.width="100%";f.style.border="0";d.style.width=""!==a.oScroll.sXInner?a.oScroll.sXInner:"100%";e.removeAttribute("id");e.style.marginLeft="0";a.nTable.style.marginLeft="0";null!==k&&(j.removeAttribute("id"),j.style.marginLeft="0");d=h(a.nTable).children("caption");0<
d.length&&(d=d[0],"top"===d._captionSide?e.appendChild(d):"bottom"===d._captionSide&&k&&j.appendChild(d));""!==a.oScroll.sX&&(c.style.width=q(a.oScroll.sX),i.style.width=q(a.oScroll.sX),null!==k&&(f.style.width=q(a.oScroll.sX)),h(i).scroll(function(){c.scrollLeft=this.scrollLeft;if(k!==null)f.scrollLeft=this.scrollLeft}));""!==a.oScroll.sY&&(i.style.height=q(a.oScroll.sY));a.aoDrawCallback.push({fn:La,sName:"scrolling"});a.oScroll.bInfinite&&h(i).scroll(function(){if(!a.bDrawing&&h(this).scrollTop()!==
0&&h(this).scrollTop()+h(this).height()>h(a.nTable).height()-a.oScroll.iLoadGap&&a.fnDisplayEnd()<a.fnRecordsDisplay()){qa(a,"next");y(a);x(a)}});a.nScrollHead=c;a.nScrollFoot=f;return b}function La(a){var b=a.nScrollHead.getElementsByTagName("div")[0],c=b.getElementsByTagName("table")[0],d=a.nTable.parentNode,i,f,g,e,j,o,k,m,p=[],n=[],l=null!==a.nTFoot?a.nScrollFoot.getElementsByTagName("div")[0]:null,R=null!==a.nTFoot?l.getElementsByTagName("table")[0]:null,r=a.oBrowser.bScrollOversize,s=function(a){k=
a.style;k.paddingTop="0";k.paddingBottom="0";k.borderTopWidth="0";k.borderBottomWidth="0";k.height=0};h(a.nTable).children("thead, tfoot").remove();i=h(a.nTHead).clone()[0];a.nTable.insertBefore(i,a.nTable.childNodes[0]);g=a.nTHead.getElementsByTagName("tr");e=i.getElementsByTagName("tr");null!==a.nTFoot&&(j=h(a.nTFoot).clone()[0],a.nTable.insertBefore(j,a.nTable.childNodes[1]),o=a.nTFoot.getElementsByTagName("tr"),j=j.getElementsByTagName("tr"));""===a.oScroll.sX&&(d.style.width="100%",b.parentNode.style.width=
"100%");var t=N(a,i);i=0;for(f=t.length;i<f;i++)m=G(a,i),t[i].style.width=a.aoColumns[m].sWidth;null!==a.nTFoot&&C(function(a){a.style.width=""},j);a.oScroll.bCollapse&&""!==a.oScroll.sY&&(d.style.height=d.offsetHeight+a.nTHead.offsetHeight+"px");i=h(a.nTable).outerWidth();if(""===a.oScroll.sX){if(a.nTable.style.width="100%",r&&(h("tbody",d).height()>d.offsetHeight||"scroll"==h(d).css("overflow-y")))a.nTable.style.width=q(h(a.nTable).outerWidth()-a.oScroll.iBarWidth)}else""!==a.oScroll.sXInner?a.nTable.style.width=
q(a.oScroll.sXInner):i==h(d).width()&&h(d).height()<h(a.nTable).height()?(a.nTable.style.width=q(i-a.oScroll.iBarWidth),h(a.nTable).outerWidth()>i-a.oScroll.iBarWidth&&(a.nTable.style.width=q(i))):a.nTable.style.width=q(i);i=h(a.nTable).outerWidth();C(s,e);C(function(a){p.push(q(h(a).width()))},e);C(function(a,b){a.style.width=p[b]},g);h(e).height(0);null!==a.nTFoot&&(C(s,j),C(function(a){n.push(q(h(a).width()))},j),C(function(a,b){a.style.width=n[b]},o),h(j).height(0));C(function(a,b){a.innerHTML=
"";a.style.width=p[b]},e);null!==a.nTFoot&&C(function(a,b){a.innerHTML="";a.style.width=n[b]},j);if(h(a.nTable).outerWidth()<i){g=d.scrollHeight>d.offsetHeight||"scroll"==h(d).css("overflow-y")?i+a.oScroll.iBarWidth:i;if(r&&(d.scrollHeight>d.offsetHeight||"scroll"==h(d).css("overflow-y")))a.nTable.style.width=q(g-a.oScroll.iBarWidth);d.style.width=q(g);a.nScrollHead.style.width=q(g);null!==a.nTFoot&&(a.nScrollFoot.style.width=q(g));""===a.oScroll.sX?D(a,1,"The table cannot fit into the current element which will cause column misalignment. The table has been drawn at its minimum possible width."):
""!==a.oScroll.sXInner&&D(a,1,"The table cannot fit into the current element which will cause column misalignment. Increase the sScrollXInner value or remove it to allow automatic calculation")}else d.style.width=q("100%"),a.nScrollHead.style.width=q("100%"),null!==a.nTFoot&&(a.nScrollFoot.style.width=q("100%"));""===a.oScroll.sY&&r&&(d.style.height=q(a.nTable.offsetHeight+a.oScroll.iBarWidth));""!==a.oScroll.sY&&a.oScroll.bCollapse&&(d.style.height=q(a.oScroll.sY),r=""!==a.oScroll.sX&&a.nTable.offsetWidth>
d.offsetWidth?a.oScroll.iBarWidth:0,a.nTable.offsetHeight<d.offsetHeight&&(d.style.height=q(a.nTable.offsetHeight+r)));r=h(a.nTable).outerWidth();c.style.width=q(r);b.style.width=q(r);c=h(a.nTable).height()>d.clientHeight||"scroll"==h(d).css("overflow-y");b.style.paddingRight=c?a.oScroll.iBarWidth+"px":"0px";null!==a.nTFoot&&(R.style.width=q(r),l.style.width=q(r),l.style.paddingRight=c?a.oScroll.iBarWidth+"px":"0px");h(d).scroll();if(a.bSorted||a.bFiltered)d.scrollTop=0}function C(a,b,c){for(var d=
0,i=0,f=b.length,g,e;i<f;){g=b[i].firstChild;for(e=c?c[i].firstChild:null;g;)1===g.nodeType&&(c?a(g,e,d):a(g,d),d++),g=g.nextSibling,e=c?e.nextSibling:null;i++}}function Ma(a,b){if(!a||null===a||""===a)return 0;b||(b=l.body);var c,d=l.createElement("div");d.style.width=q(a);b.appendChild(d);c=d.offsetWidth;b.removeChild(d);return c}function da(a){var b=0,c,d=0,i=a.aoColumns.length,f,e,j=h("th",a.nTHead),o=a.nTable.getAttribute("width");e=a.nTable.parentNode;for(f=0;f<i;f++)a.aoColumns[f].bVisible&&
(d++,null!==a.aoColumns[f].sWidth&&(c=Ma(a.aoColumns[f].sWidthOrig,e),null!==c&&(a.aoColumns[f].sWidth=q(c)),b++));if(i==j.length&&0===b&&d==i&&""===a.oScroll.sX&&""===a.oScroll.sY)for(f=0;f<a.aoColumns.length;f++)c=h(j[f]).width(),null!==c&&(a.aoColumns[f].sWidth=q(c));else{b=a.nTable.cloneNode(!1);f=a.nTHead.cloneNode(!0);d=l.createElement("tbody");c=l.createElement("tr");b.removeAttribute("id");b.appendChild(f);null!==a.nTFoot&&(b.appendChild(a.nTFoot.cloneNode(!0)),C(function(a){a.style.width=
""},b.getElementsByTagName("tr")));b.appendChild(d);d.appendChild(c);d=h("thead th",b);0===d.length&&(d=h("tbody tr:eq(0)>td",b));j=N(a,f);for(f=d=0;f<i;f++){var k=a.aoColumns[f];k.bVisible&&null!==k.sWidthOrig&&""!==k.sWidthOrig?j[f-d].style.width=q(k.sWidthOrig):k.bVisible?j[f-d].style.width="":d++}for(f=0;f<i;f++)a.aoColumns[f].bVisible&&(d=Na(a,f),null!==d&&(d=d.cloneNode(!0),""!==a.aoColumns[f].sContentPadding&&(d.innerHTML+=a.aoColumns[f].sContentPadding),c.appendChild(d)));e.appendChild(b);
""!==a.oScroll.sX&&""!==a.oScroll.sXInner?b.style.width=q(a.oScroll.sXInner):""!==a.oScroll.sX?(b.style.width="",h(b).width()<e.offsetWidth&&(b.style.width=q(e.offsetWidth))):""!==a.oScroll.sY?b.style.width=q(e.offsetWidth):o&&(b.style.width=q(o));b.style.visibility="hidden";Oa(a,b);i=h("tbody tr:eq(0)",b).children();0===i.length&&(i=N(a,h("thead",b)[0]));if(""!==a.oScroll.sX){for(f=d=e=0;f<a.aoColumns.length;f++)a.aoColumns[f].bVisible&&(e=null===a.aoColumns[f].sWidthOrig?e+h(i[d]).outerWidth():
e+(parseInt(a.aoColumns[f].sWidth.replace("px",""),10)+(h(i[d]).outerWidth()-h(i[d]).width())),d++);b.style.width=q(e);a.nTable.style.width=q(e)}for(f=d=0;f<a.aoColumns.length;f++)a.aoColumns[f].bVisible&&(e=h(i[d]).width(),null!==e&&0<e&&(a.aoColumns[f].sWidth=q(e)),d++);i=h(b).css("width");a.nTable.style.width=-1!==i.indexOf("%")?i:q(h(b).outerWidth());b.parentNode.removeChild(b)}o&&(a.nTable.style.width=q(o))}function Oa(a,b){""===a.oScroll.sX&&""!==a.oScroll.sY?(h(b).width(),b.style.width=q(h(b).outerWidth()-
a.oScroll.iBarWidth)):""!==a.oScroll.sX&&(b.style.width=q(h(b).outerWidth()))}function Na(a,b){var c=Pa(a,b);if(0>c)return null;if(null===a.aoData[c].nTr){var d=l.createElement("td");d.innerHTML=v(a,c,b,"");return d}return J(a,c)[b]}function Pa(a,b){for(var c=-1,d=-1,i=0;i<a.aoData.length;i++){var e=v(a,i,b,"display")+"",e=e.replace(/<.*?>/g,"");e.length>c&&(c=e.length,d=i)}return d}function q(a){if(null===a)return"0px";if("number"==typeof a)return 0>a?"0px":a+"px";var b=a.charCodeAt(a.length-1);
return 48>b||57<b?a:a+"px"}function Qa(){var a=l.createElement("p"),b=a.style;b.width="100%";b.height="200px";b.padding="0px";var c=l.createElement("div"),b=c.style;b.position="absolute";b.top="0px";b.left="0px";b.visibility="hidden";b.width="200px";b.height="150px";b.padding="0px";b.overflow="hidden";c.appendChild(a);l.body.appendChild(c);b=a.offsetWidth;c.style.overflow="scroll";a=a.offsetWidth;b==a&&(a=c.clientWidth);l.body.removeChild(c);return b-a}function O(a,b){var c,d,i,e,g,k,o=[],m=[],p=
j.ext.oSort,l=a.aoData,q=a.aoColumns,G=a.oLanguage.oAria;if(!a.oFeatures.bServerSide&&(0!==a.aaSorting.length||null!==a.aaSortingFixed)){o=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(c=0;c<o.length;c++)if(d=o[c][0],i=R(a,d),e=a.aoColumns[d].sSortDataType,j.ext.afnSortData[e])if(g=j.ext.afnSortData[e].call(a.oInstance,a,d,i),g.length===l.length){i=0;for(e=l.length;i<e;i++)F(a,i,d,g[i])}else D(a,0,"Returned data sort array (col "+d+") is the wrong length");c=
0;for(d=a.aiDisplayMaster.length;c<d;c++)m[a.aiDisplayMaster[c]]=c;var r=o.length,s;c=0;for(d=l.length;c<d;c++)for(i=0;i<r;i++){s=q[o[i][0]].aDataSort;g=0;for(k=s.length;g<k;g++)e=q[s[g]].sType,e=p[(e?e:"string")+"-pre"],l[c]._aSortData[s[g]]=e?e(v(a,c,s[g],"sort")):v(a,c,s[g],"sort")}a.aiDisplayMaster.sort(function(a,b){var c,d,e,i,f;for(c=0;c<r;c++){f=q[o[c][0]].aDataSort;d=0;for(e=f.length;d<e;d++)if(i=q[f[d]].sType,i=p[(i?i:"string")+"-"+o[c][1]](l[a]._aSortData[f[d]],l[b]._aSortData[f[d]]),0!==
i)return i}return p["numeric-asc"](m[a],m[b])})}(b===n||b)&&!a.oFeatures.bDeferRender&&P(a);c=0;for(d=a.aoColumns.length;c<d;c++)e=q[c].sTitle.replace(/<.*?>/g,""),i=q[c].nTh,i.removeAttribute("aria-sort"),i.removeAttribute("aria-label"),q[c].bSortable?0<o.length&&o[0][0]==c?(i.setAttribute("aria-sort","asc"==o[0][1]?"ascending":"descending"),i.setAttribute("aria-label",e+("asc"==(q[c].asSorting[o[0][2]+1]?q[c].asSorting[o[0][2]+1]:q[c].asSorting[0])?G.sSortAscending:G.sSortDescending))):i.setAttribute("aria-label",
e+("asc"==q[c].asSorting[0]?G.sSortAscending:G.sSortDescending)):i.setAttribute("aria-label",e);a.bSorted=!0;h(a.oInstance).trigger("sort",a);a.oFeatures.bFilter?K(a,a.oPreviousSearch,1):(a.aiDisplay=a.aiDisplayMaster.slice(),a._iDisplayStart=0,y(a),x(a))}function ia(a,b,c,d){Ra(b,{},function(b){if(!1!==a.aoColumns[c].bSortable){var e=function(){var d,e;if(b.shiftKey){for(var f=!1,h=0;h<a.aaSorting.length;h++)if(a.aaSorting[h][0]==c){f=!0;d=a.aaSorting[h][0];e=a.aaSorting[h][2]+1;a.aoColumns[d].asSorting[e]?
(a.aaSorting[h][1]=a.aoColumns[d].asSorting[e],a.aaSorting[h][2]=e):a.aaSorting.splice(h,1);break}!1===f&&a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0])}else 1==a.aaSorting.length&&a.aaSorting[0][0]==c?(d=a.aaSorting[0][0],e=a.aaSorting[0][2]+1,a.aoColumns[d].asSorting[e]||(e=0),a.aaSorting[0][1]=a.aoColumns[d].asSorting[e],a.aaSorting[0][2]=e):(a.aaSorting.splice(0,a.aaSorting.length),a.aaSorting.push([c,a.aoColumns[c].asSorting[0],0]));O(a)};a.oFeatures.bProcessing?(E(a,!0),setTimeout(function(){e();
a.oFeatures.bServerSide||E(a,!1)},0)):e();"function"==typeof d&&d(a)}})}function P(a){var b,c,d,e,f,g=a.aoColumns.length,j=a.oClasses;for(b=0;b<g;b++)a.aoColumns[b].bSortable&&h(a.aoColumns[b].nTh).removeClass(j.sSortAsc+" "+j.sSortDesc+" "+a.aoColumns[b].sSortingClass);c=null!==a.aaSortingFixed?a.aaSortingFixed.concat(a.aaSorting):a.aaSorting.slice();for(b=0;b<a.aoColumns.length;b++)if(a.aoColumns[b].bSortable){f=a.aoColumns[b].sSortingClass;e=-1;for(d=0;d<c.length;d++)if(c[d][0]==b){f="asc"==c[d][1]?
j.sSortAsc:j.sSortDesc;e=d;break}h(a.aoColumns[b].nTh).addClass(f);a.bJUI&&(f=h("span."+j.sSortIcon,a.aoColumns[b].nTh),f.removeClass(j.sSortJUIAsc+" "+j.sSortJUIDesc+" "+j.sSortJUI+" "+j.sSortJUIAscAllowed+" "+j.sSortJUIDescAllowed),f.addClass(-1==e?a.aoColumns[b].sSortingClassJUI:"asc"==c[e][1]?j.sSortJUIAsc:j.sSortJUIDesc))}else h(a.aoColumns[b].nTh).addClass(a.aoColumns[b].sSortingClass);f=j.sSortColumn;if(a.oFeatures.bSort&&a.oFeatures.bSortClasses){a=J(a);e=[];for(b=0;b<g;b++)e.push("");b=0;
for(d=1;b<c.length;b++)j=parseInt(c[b][0],10),e[j]=f+d,3>d&&d++;f=RegExp(f+"[123]");var o;b=0;for(c=a.length;b<c;b++)j=b%g,d=a[b].className,o=e[j],j=d.replace(f,o),j!=d?a[b].className=h.trim(j):0<o.length&&-1==d.indexOf(o)&&(a[b].className=d+" "+o)}}function ra(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b,c;b=a.oScroll.bInfinite;var d={iCreate:(new Date).getTime(),iStart:b?0:a._iDisplayStart,iEnd:b?a._iDisplayLength:a._iDisplayEnd,iLength:a._iDisplayLength,aaSorting:h.extend(!0,[],a.aaSorting),
oSearch:h.extend(!0,{},a.oPreviousSearch),aoSearchCols:h.extend(!0,[],a.aoPreSearchCols),abVisCols:[]};b=0;for(c=a.aoColumns.length;b<c;b++)d.abVisCols.push(a.aoColumns[b].bVisible);A(a,"aoStateSaveParams","stateSaveParams",[a,d]);a.fnStateSave.call(a.oInstance,a,d)}}function Sa(a,b){if(a.oFeatures.bStateSave){var c=a.fnStateLoad.call(a.oInstance,a);if(c){var d=A(a,"aoStateLoadParams","stateLoadParams",[a,c]);if(-1===h.inArray(!1,d)){a.oLoadedState=h.extend(!0,{},c);a._iDisplayStart=c.iStart;a.iInitDisplayStart=
c.iStart;a._iDisplayEnd=c.iEnd;a._iDisplayLength=c.iLength;a.aaSorting=c.aaSorting.slice();a.saved_aaSorting=c.aaSorting.slice();h.extend(a.oPreviousSearch,c.oSearch);h.extend(!0,a.aoPreSearchCols,c.aoSearchCols);b.saved_aoColumns=[];for(d=0;d<c.abVisCols.length;d++)b.saved_aoColumns[d]={},b.saved_aoColumns[d].bVisible=c.abVisCols[d];A(a,"aoStateLoaded","stateLoaded",[a,c])}}}}function s(a){for(var b=0;b<j.settings.length;b++)if(j.settings[b].nTable===a)return j.settings[b];return null}function T(a){for(var b=
[],a=a.aoData,c=0,d=a.length;c<d;c++)null!==a[c].nTr&&b.push(a[c].nTr);return b}function J(a,b){var c=[],d,e,f,g,h,j;e=0;var o=a.aoData.length;b!==n&&(e=b,o=b+1);for(f=e;f<o;f++)if(j=a.aoData[f],null!==j.nTr){e=[];for(d=j.nTr.firstChild;d;)g=d.nodeName.toLowerCase(),("td"==g||"th"==g)&&e.push(d),d=d.nextSibling;g=d=0;for(h=a.aoColumns.length;g<h;g++)a.aoColumns[g].bVisible?c.push(e[g-d]):(c.push(j._anHidden[g]),d++)}return c}function D(a,b,c){a=null===a?"DataTables warning: "+c:"DataTables warning (table id = '"+
a.sTableId+"'): "+c;if(0===b)if("alert"==j.ext.sErrMode)alert(a);else throw Error(a);else X.console&&console.log&&console.log(a)}function p(a,b,c,d){d===n&&(d=c);b[c]!==n&&(a[d]=b[c])}function Ta(a,b){var c,d;for(d in b)b.hasOwnProperty(d)&&(c=b[d],"object"===typeof e[d]&&null!==c&&!1===h.isArray(c)?h.extend(!0,a[d],c):a[d]=c);return a}function Ra(a,b,c){h(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===a.which&&c(a)}).bind("selectstart.DT",function(){return!1})}
function z(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function A(a,b,c,d){for(var b=a[b],e=[],f=b.length-1;0<=f;f--)e.push(b[f].fn.apply(a.oInstance,d));null!==c&&h(a.oInstance).trigger(c,d);return e}function Ua(a){var b=h('<div style="position:absolute; top:0; left:0; height:1px; width:1px; overflow:hidden"><div style="position:absolute; top:1px; left:1px; width:100px; overflow:scroll;"><div id="DT_BrowserTest" style="width:100%; height:10px;"></div></div></div>')[0];l.body.appendChild(b);a.oBrowser.bScrollOversize=
100===h("#DT_BrowserTest",b)[0].offsetWidth?!0:!1;l.body.removeChild(b)}function Va(a){return function(){var b=[s(this[j.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return j.ext.oApi[a].apply(this,b)}}var U=/\[.*?\]$/,Wa=X.JSON?JSON.stringify:function(a){var b=typeof a;if("object"!==b||null===a)return"string"===b&&(a='"'+a+'"'),a+"";var c,d,e=[],f=h.isArray(a);for(c in a)d=a[c],b=typeof d,"string"===b?d='"'+d+'"':"object"===b&&null!==d&&(d=Wa(d)),e.push((f?"":'"'+c+'":')+d);return(f?
"[":"{")+e+(f?"]":"}")};this.$=function(a,b){var c,d,e=[],f;d=s(this[j.ext.iApiIndex]);var g=d.aoData,o=d.aiDisplay,k=d.aiDisplayMaster;b||(b={});b=h.extend({},{filter:"none",order:"current",page:"all"},b);if("current"==b.page){c=d._iDisplayStart;for(d=d.fnDisplayEnd();c<d;c++)(f=g[o[c]].nTr)&&e.push(f)}else if("current"==b.order&&"none"==b.filter){c=0;for(d=k.length;c<d;c++)(f=g[k[c]].nTr)&&e.push(f)}else if("current"==b.order&&"applied"==b.filter){c=0;for(d=o.length;c<d;c++)(f=g[o[c]].nTr)&&e.push(f)}else if("original"==
b.order&&"none"==b.filter){c=0;for(d=g.length;c<d;c++)(f=g[c].nTr)&&e.push(f)}else if("original"==b.order&&"applied"==b.filter){c=0;for(d=g.length;c<d;c++)f=g[c].nTr,-1!==h.inArray(c,o)&&f&&e.push(f)}else D(d,1,"Unknown selection options");e=h(e);c=e.filter(a);e=e.find(a);return h([].concat(h.makeArray(c),h.makeArray(e)))};this._=function(a,b){var c=[],d,e,f=this.$(a,b);d=0;for(e=f.length;d<e;d++)c.push(this.fnGetData(f[d]));return c};this.fnAddData=function(a,b){if(0===a.length)return[];var c=[],
d,e=s(this[j.ext.iApiIndex]);if("object"===typeof a[0]&&null!==a[0])for(var f=0;f<a.length;f++){d=H(e,a[f]);if(-1==d)return c;c.push(d)}else{d=H(e,a);if(-1==d)return c;c.push(d)}e.aiDisplay=e.aiDisplayMaster.slice();(b===n||b)&&aa(e);return c};this.fnAdjustColumnSizing=function(a){var b=s(this[j.ext.iApiIndex]);k(b);a===n||a?this.fnDraw(!1):(""!==b.oScroll.sX||""!==b.oScroll.sY)&&this.oApi._fnScrollDraw(b)};this.fnClearTable=function(a){var b=s(this[j.ext.iApiIndex]);ga(b);(a===n||a)&&x(b)};this.fnClose=
function(a){for(var b=s(this[j.ext.iApiIndex]),c=0;c<b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return(a=b.aoOpenRows[c].nTr.parentNode)&&a.removeChild(b.aoOpenRows[c].nTr),b.aoOpenRows.splice(c,1),0;return 1};this.fnDeleteRow=function(a,b,c){var d=s(this[j.ext.iApiIndex]),e,f,a="object"===typeof a?I(d,a):a,g=d.aoData.splice(a,1);e=0;for(f=d.aoData.length;e<f;e++)null!==d.aoData[e].nTr&&(d.aoData[e].nTr._DT_RowIndex=e);e=h.inArray(a,d.aiDisplay);d.asDataSearch.splice(e,1);ha(d.aiDisplayMaster,
a);ha(d.aiDisplay,a);"function"===typeof b&&b.call(this,d,g);d._iDisplayStart>=d.fnRecordsDisplay()&&(d._iDisplayStart-=d._iDisplayLength,0>d._iDisplayStart&&(d._iDisplayStart=0));if(c===n||c)y(d),x(d);return g};this.fnDestroy=function(a){var b=s(this[j.ext.iApiIndex]),c=b.nTableWrapper.parentNode,d=b.nTBody,i,f,a=a===n?!1:a;b.bDestroying=!0;A(b,"aoDestroyCallback","destroy",[b]);if(!a){i=0;for(f=b.aoColumns.length;i<f;i++)!1===b.aoColumns[i].bVisible&&this.fnSetColumnVis(i,!0)}h(b.nTableWrapper).find("*").andSelf().unbind(".DT");
h("tbody>tr>td."+b.oClasses.sRowEmpty,b.nTable).parent().remove();b.nTable!=b.nTHead.parentNode&&(h(b.nTable).children("thead").remove(),b.nTable.appendChild(b.nTHead));b.nTFoot&&b.nTable!=b.nTFoot.parentNode&&(h(b.nTable).children("tfoot").remove(),b.nTable.appendChild(b.nTFoot));b.nTable.parentNode.removeChild(b.nTable);h(b.nTableWrapper).remove();b.aaSorting=[];b.aaSortingFixed=[];P(b);h(T(b)).removeClass(b.asStripeClasses.join(" "));h("th, td",b.nTHead).removeClass([b.oClasses.sSortable,b.oClasses.sSortableAsc,
b.oClasses.sSortableDesc,b.oClasses.sSortableNone].join(" "));b.bJUI&&(h("th span."+b.oClasses.sSortIcon+", td span."+b.oClasses.sSortIcon,b.nTHead).remove(),h("th, td",b.nTHead).each(function(){var a=h("div."+b.oClasses.sSortJUIWrapper,this),c=a.contents();h(this).append(c);a.remove()}));!a&&b.nTableReinsertBefore?c.insertBefore(b.nTable,b.nTableReinsertBefore):a||c.appendChild(b.nTable);i=0;for(f=b.aoData.length;i<f;i++)null!==b.aoData[i].nTr&&d.appendChild(b.aoData[i].nTr);!0===b.oFeatures.bAutoWidth&&
(b.nTable.style.width=q(b.sDestroyWidth));if(f=b.asDestroyStripes.length){a=h(d).children("tr");for(i=0;i<f;i++)a.filter(":nth-child("+f+"n + "+i+")").addClass(b.asDestroyStripes[i])}i=0;for(f=j.settings.length;i<f;i++)j.settings[i]==b&&j.settings.splice(i,1);e=b=null};this.fnDraw=function(a){var b=s(this[j.ext.iApiIndex]);!1===a?(y(b),x(b)):aa(b)};this.fnFilter=function(a,b,c,d,e,f){var g=s(this[j.ext.iApiIndex]);if(g.oFeatures.bFilter){if(c===n||null===c)c=!1;if(d===n||null===d)d=!0;if(e===n||null===
e)e=!0;if(f===n||null===f)f=!0;if(b===n||null===b){if(K(g,{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:f},1),e&&g.aanFeatures.f){b=g.aanFeatures.f;c=0;for(d=b.length;c<d;c++)try{b[c]._DT_Input!=l.activeElement&&h(b[c]._DT_Input).val(a)}catch(o){h(b[c]._DT_Input).val(a)}}}else h.extend(g.aoPreSearchCols[b],{sSearch:a+"",bRegex:c,bSmart:d,bCaseInsensitive:f}),K(g,g.oPreviousSearch,1)}};this.fnGetData=function(a,b){var c=s(this[j.ext.iApiIndex]);if(a!==n){var d=a;if("object"===typeof a){var e=a.nodeName.toLowerCase();
"tr"===e?d=I(c,a):"td"===e&&(d=I(c,a.parentNode),b=fa(c,d,a))}return b!==n?v(c,d,b,""):c.aoData[d]!==n?c.aoData[d]._aData:null}return Z(c)};this.fnGetNodes=function(a){var b=s(this[j.ext.iApiIndex]);return a!==n?b.aoData[a]!==n?b.aoData[a].nTr:null:T(b)};this.fnGetPosition=function(a){var b=s(this[j.ext.iApiIndex]),c=a.nodeName.toUpperCase();return"TR"==c?I(b,a):"TD"==c||"TH"==c?(c=I(b,a.parentNode),a=fa(b,c,a),[c,R(b,a),a]):null};this.fnIsOpen=function(a){for(var b=s(this[j.ext.iApiIndex]),c=0;c<
b.aoOpenRows.length;c++)if(b.aoOpenRows[c].nParent==a)return!0;return!1};this.fnOpen=function(a,b,c){var d=s(this[j.ext.iApiIndex]),e=T(d);if(-1!==h.inArray(a,e)){this.fnClose(a);var e=l.createElement("tr"),f=l.createElement("td");e.appendChild(f);f.className=c;f.colSpan=t(d);"string"===typeof b?f.innerHTML=b:h(f).html(b);b=h("tr",d.nTBody);-1!=h.inArray(a,b)&&h(e).insertAfter(a);d.aoOpenRows.push({nTr:e,nParent:a});return e}};this.fnPageChange=function(a,b){var c=s(this[j.ext.iApiIndex]);qa(c,a);
y(c);(b===n||b)&&x(c)};this.fnSetColumnVis=function(a,b,c){var d=s(this[j.ext.iApiIndex]),e,f,g=d.aoColumns,h=d.aoData,o,m;if(g[a].bVisible!=b){if(b){for(e=f=0;e<a;e++)g[e].bVisible&&f++;m=f>=t(d);if(!m)for(e=a;e<g.length;e++)if(g[e].bVisible){o=e;break}e=0;for(f=h.length;e<f;e++)null!==h[e].nTr&&(m?h[e].nTr.appendChild(h[e]._anHidden[a]):h[e].nTr.insertBefore(h[e]._anHidden[a],J(d,e)[o]))}else{e=0;for(f=h.length;e<f;e++)null!==h[e].nTr&&(o=J(d,e)[a],h[e]._anHidden[a]=o,o.parentNode.removeChild(o))}g[a].bVisible=
b;W(d,d.aoHeader);d.nTFoot&&W(d,d.aoFooter);e=0;for(f=d.aoOpenRows.length;e<f;e++)d.aoOpenRows[e].nTr.colSpan=t(d);if(c===n||c)k(d),x(d);ra(d)}};this.fnSettings=function(){return s(this[j.ext.iApiIndex])};this.fnSort=function(a){var b=s(this[j.ext.iApiIndex]);b.aaSorting=a;O(b)};this.fnSortListener=function(a,b,c){ia(s(this[j.ext.iApiIndex]),a,b,c)};this.fnUpdate=function(a,b,c,d,e){var f=s(this[j.ext.iApiIndex]),b="object"===typeof b?I(f,b):b;if(h.isArray(a)&&c===n){f.aoData[b]._aData=a.slice();
for(c=0;c<f.aoColumns.length;c++)this.fnUpdate(v(f,b,c),b,c,!1,!1)}else if(h.isPlainObject(a)&&c===n){f.aoData[b]._aData=h.extend(!0,{},a);for(c=0;c<f.aoColumns.length;c++)this.fnUpdate(v(f,b,c),b,c,!1,!1)}else{F(f,b,c,a);var a=v(f,b,c,"display"),g=f.aoColumns[c];null!==g.fnRender&&(a=S(f,b,c),g.bUseRendered&&F(f,b,c,a));null!==f.aoData[b].nTr&&(J(f,b)[c].innerHTML=a)}c=h.inArray(b,f.aiDisplay);f.asDataSearch[c]=na(f,Y(f,b,"filter",r(f,"bSearchable")));(e===n||e)&&k(f);(d===n||d)&&aa(f);return 0};
this.fnVersionCheck=j.ext.fnVersionCheck;this.oApi={_fnExternApiFunc:Va,_fnInitialise:ba,_fnInitComplete:$,_fnLanguageCompat:pa,_fnAddColumn:o,_fnColumnOptions:m,_fnAddData:H,_fnCreateTr:ea,_fnGatherData:ua,_fnBuildHead:va,_fnDrawHead:W,_fnDraw:x,_fnReDraw:aa,_fnAjaxUpdate:wa,_fnAjaxParameters:Ea,_fnAjaxUpdateDraw:Fa,_fnServerParams:ka,_fnAddOptionsHtml:xa,_fnFeatureHtmlTable:Ba,_fnScrollDraw:La,_fnAdjustColumnSizing:k,_fnFeatureHtmlFilter:za,_fnFilterComplete:K,_fnFilterCustom:Ia,_fnFilterColumn:Ha,
_fnFilter:Ga,_fnBuildSearchArray:la,_fnBuildSearchRow:na,_fnFilterCreateSearch:ma,_fnDataToSearch:Ja,_fnSort:O,_fnSortAttachListener:ia,_fnSortingClasses:P,_fnFeatureHtmlPaginate:Da,_fnPageChange:qa,_fnFeatureHtmlInfo:Ca,_fnUpdateInfo:Ka,_fnFeatureHtmlLength:ya,_fnFeatureHtmlProcessing:Aa,_fnProcessingDisplay:E,_fnVisibleToColumnIndex:G,_fnColumnIndexToVisible:R,_fnNodeToDataIndex:I,_fnVisbleColumns:t,_fnCalculateEnd:y,_fnConvertToWidth:Ma,_fnCalculateColumnWidths:da,_fnScrollingWidthAdjust:Oa,_fnGetWidestNode:Na,
_fnGetMaxLenString:Pa,_fnStringToCss:q,_fnDetectType:B,_fnSettingsFromNode:s,_fnGetDataMaster:Z,_fnGetTrNodes:T,_fnGetTdNodes:J,_fnEscapeRegex:oa,_fnDeleteIndex:ha,_fnReOrderIndex:u,_fnColumnOrdering:M,_fnLog:D,_fnClearTable:ga,_fnSaveState:ra,_fnLoadState:Sa,_fnCreateCookie:function(a,b,c,d,e){var f=new Date;f.setTime(f.getTime()+1E3*c);var c=X.location.pathname.split("/"),a=a+"_"+c.pop().replace(/[\/:]/g,"").toLowerCase(),g;null!==e?(g="function"===typeof h.parseJSON?h.parseJSON(b):eval("("+b+")"),
b=e(a,g,f.toGMTString(),c.join("/")+"/")):b=a+"="+encodeURIComponent(b)+"; expires="+f.toGMTString()+"; path="+c.join("/")+"/";a=l.cookie.split(";");e=b.split(";")[0].length;f=[];if(4096<e+l.cookie.length+10){for(var j=0,o=a.length;j<o;j++)if(-1!=a[j].indexOf(d)){var k=a[j].split("=");try{(g=eval("("+decodeURIComponent(k[1])+")"))&&g.iCreate&&f.push({name:k[0],time:g.iCreate})}catch(m){}}for(f.sort(function(a,b){return b.time-a.time});4096<e+l.cookie.length+10;){if(0===f.length)return;d=f.pop();l.cookie=
d.name+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path="+c.join("/")+"/"}}l.cookie=b},_fnReadCookie:function(a){for(var b=X.location.pathname.split("/"),a=a+"_"+b[b.length-1].replace(/[\/:]/g,"").toLowerCase()+"=",b=l.cookie.split(";"),c=0;c<b.length;c++){for(var d=b[c];" "==d.charAt(0);)d=d.substring(1,d.length);if(0===d.indexOf(a))return decodeURIComponent(d.substring(a.length,d.length))}return null},_fnDetectHeader:V,_fnGetUniqueThs:N,_fnScrollBarWidth:Qa,_fnApplyToChildren:C,_fnMap:p,_fnGetRowData:Y,
_fnGetCellData:v,_fnSetCellData:F,_fnGetObjectDataFn:Q,_fnSetObjectDataFn:L,_fnApplyColumnDefs:ta,_fnBindAction:Ra,_fnExtend:Ta,_fnCallbackReg:z,_fnCallbackFire:A,_fnJsonString:Wa,_fnRender:S,_fnNodeToColumnIndex:fa,_fnInfoMacros:ja,_fnBrowserDetect:Ua,_fnGetColumns:r};h.extend(j.ext.oApi,this.oApi);for(var sa in j.ext.oApi)sa&&(this[sa]=Va(sa));var ca=this;this.each(function(){var a=0,b,c,d;c=this.getAttribute("id");var i=!1,f=!1;if("table"!=this.nodeName.toLowerCase())D(null,0,"Attempted to initialise DataTables on a node which is not a table: "+
this.nodeName);else{a=0;for(b=j.settings.length;a<b;a++){if(j.settings[a].nTable==this){if(e===n||e.bRetrieve)return j.settings[a].oInstance;if(e.bDestroy){j.settings[a].oInstance.fnDestroy();break}else{D(j.settings[a],0,"Cannot reinitialise DataTable.\n\nTo retrieve the DataTables object for this table, pass no arguments or see the docs for bRetrieve and bDestroy");return}}if(j.settings[a].sTableId==this.id){j.settings.splice(a,1);break}}if(null===c||""===c)this.id=c="DataTables_Table_"+j.ext._oExternConfig.iNextUnique++;
var g=h.extend(!0,{},j.models.oSettings,{nTable:this,oApi:ca.oApi,oInit:e,sDestroyWidth:h(this).width(),sInstance:c,sTableId:c});j.settings.push(g);g.oInstance=1===ca.length?ca:h(this).dataTable();e||(e={});e.oLanguage&&pa(e.oLanguage);e=Ta(h.extend(!0,{},j.defaults),e);p(g.oFeatures,e,"bPaginate");p(g.oFeatures,e,"bLengthChange");p(g.oFeatures,e,"bFilter");p(g.oFeatures,e,"bSort");p(g.oFeatures,e,"bInfo");p(g.oFeatures,e,"bProcessing");p(g.oFeatures,e,"bAutoWidth");p(g.oFeatures,e,"bSortClasses");
p(g.oFeatures,e,"bServerSide");p(g.oFeatures,e,"bDeferRender");p(g.oScroll,e,"sScrollX","sX");p(g.oScroll,e,"sScrollXInner","sXInner");p(g.oScroll,e,"sScrollY","sY");p(g.oScroll,e,"bScrollCollapse","bCollapse");p(g.oScroll,e,"bScrollInfinite","bInfinite");p(g.oScroll,e,"iScrollLoadGap","iLoadGap");p(g.oScroll,e,"bScrollAutoCss","bAutoCss");p(g,e,"asStripeClasses");p(g,e,"asStripClasses","asStripeClasses");p(g,e,"fnServerData");p(g,e,"fnFormatNumber");p(g,e,"sServerMethod");p(g,e,"aaSorting");p(g,
e,"aaSortingFixed");p(g,e,"aLengthMenu");p(g,e,"sPaginationType");p(g,e,"sAjaxSource");p(g,e,"sAjaxDataProp");p(g,e,"iCookieDuration");p(g,e,"sCookiePrefix");p(g,e,"sDom");p(g,e,"bSortCellsTop");p(g,e,"iTabIndex");p(g,e,"oSearch","oPreviousSearch");p(g,e,"aoSearchCols","aoPreSearchCols");p(g,e,"iDisplayLength","_iDisplayLength");p(g,e,"bJQueryUI","bJUI");p(g,e,"fnCookieCallback");p(g,e,"fnStateLoad");p(g,e,"fnStateSave");p(g.oLanguage,e,"fnInfoCallback");z(g,"aoDrawCallback",e.fnDrawCallback,"user");
z(g,"aoServerParams",e.fnServerParams,"user");z(g,"aoStateSaveParams",e.fnStateSaveParams,"user");z(g,"aoStateLoadParams",e.fnStateLoadParams,"user");z(g,"aoStateLoaded",e.fnStateLoaded,"user");z(g,"aoRowCallback",e.fnRowCallback,"user");z(g,"aoRowCreatedCallback",e.fnCreatedRow,"user");z(g,"aoHeaderCallback",e.fnHeaderCallback,"user");z(g,"aoFooterCallback",e.fnFooterCallback,"user");z(g,"aoInitComplete",e.fnInitComplete,"user");z(g,"aoPreDrawCallback",e.fnPreDrawCallback,"user");g.oFeatures.bServerSide&&
g.oFeatures.bSort&&g.oFeatures.bSortClasses?z(g,"aoDrawCallback",P,"server_side_sort_classes"):g.oFeatures.bDeferRender&&z(g,"aoDrawCallback",P,"defer_sort_classes");e.bJQueryUI?(h.extend(g.oClasses,j.ext.oJUIClasses),e.sDom===j.defaults.sDom&&"lfrtip"===j.defaults.sDom&&(g.sDom='<"H"lfr>t<"F"ip>')):h.extend(g.oClasses,j.ext.oStdClasses);h(this).addClass(g.oClasses.sTable);if(""!==g.oScroll.sX||""!==g.oScroll.sY)g.oScroll.iBarWidth=Qa();g.iInitDisplayStart===n&&(g.iInitDisplayStart=e.iDisplayStart,
g._iDisplayStart=e.iDisplayStart);e.bStateSave&&(g.oFeatures.bStateSave=!0,Sa(g,e),z(g,"aoDrawCallback",ra,"state_save"));null!==e.iDeferLoading&&(g.bDeferLoading=!0,a=h.isArray(e.iDeferLoading),g._iRecordsDisplay=a?e.iDeferLoading[0]:e.iDeferLoading,g._iRecordsTotal=a?e.iDeferLoading[1]:e.iDeferLoading);null!==e.aaData&&(f=!0);""!==e.oLanguage.sUrl?(g.oLanguage.sUrl=e.oLanguage.sUrl,h.getJSON(g.oLanguage.sUrl,null,function(a){pa(a);h.extend(true,g.oLanguage,e.oLanguage,a);ba(g)}),i=!0):h.extend(!0,
g.oLanguage,e.oLanguage);null===e.asStripeClasses&&(g.asStripeClasses=[g.oClasses.sStripeOdd,g.oClasses.sStripeEven]);b=g.asStripeClasses.length;g.asDestroyStripes=[];if(b){c=!1;d=h(this).children("tbody").children("tr:lt("+b+")");for(a=0;a<b;a++)d.hasClass(g.asStripeClasses[a])&&(c=!0,g.asDestroyStripes.push(g.asStripeClasses[a]));c&&d.removeClass(g.asStripeClasses.join(" "))}c=[];a=this.getElementsByTagName("thead");0!==a.length&&(V(g.aoHeader,a[0]),c=N(g));if(null===e.aoColumns){d=[];a=0;for(b=
c.length;a<b;a++)d.push(null)}else d=e.aoColumns;a=0;for(b=d.length;a<b;a++)e.saved_aoColumns!==n&&e.saved_aoColumns.length==b&&(null===d[a]&&(d[a]={}),d[a].bVisible=e.saved_aoColumns[a].bVisible),o(g,c?c[a]:null);ta(g,e.aoColumnDefs,d,function(a,b){m(g,a,b)});a=0;for(b=g.aaSorting.length;a<b;a++){g.aaSorting[a][0]>=g.aoColumns.length&&(g.aaSorting[a][0]=0);var k=g.aoColumns[g.aaSorting[a][0]];g.aaSorting[a][2]===n&&(g.aaSorting[a][2]=0);e.aaSorting===n&&g.saved_aaSorting===n&&(g.aaSorting[a][1]=
k.asSorting[0]);c=0;for(d=k.asSorting.length;c<d;c++)if(g.aaSorting[a][1]==k.asSorting[c]){g.aaSorting[a][2]=c;break}}P(g);Ua(g);a=h(this).children("caption").each(function(){this._captionSide=h(this).css("caption-side")});b=h(this).children("thead");0===b.length&&(b=[l.createElement("thead")],this.appendChild(b[0]));g.nTHead=b[0];b=h(this).children("tbody");0===b.length&&(b=[l.createElement("tbody")],this.appendChild(b[0]));g.nTBody=b[0];g.nTBody.setAttribute("role","alert");g.nTBody.setAttribute("aria-live",
"polite");g.nTBody.setAttribute("aria-relevant","all");b=h(this).children("tfoot");if(0===b.length&&0<a.length&&(""!==g.oScroll.sX||""!==g.oScroll.sY))b=[l.createElement("tfoot")],this.appendChild(b[0]);0<b.length&&(g.nTFoot=b[0],V(g.aoFooter,g.nTFoot));if(f)for(a=0;a<e.aaData.length;a++)H(g,e.aaData[a]);else ua(g);g.aiDisplay=g.aiDisplayMaster.slice();g.bInitialised=!0;!1===i&&ba(g)}});ca=null;return this};j.fnVersionCheck=function(e){for(var h=function(e,h){for(;e.length<h;)e+="0";return e},m=j.ext.sVersion.split("."),
e=e.split("."),k="",n="",l=0,t=e.length;l<t;l++)k+=h(m[l],3),n+=h(e[l],3);return parseInt(k,10)>=parseInt(n,10)};j.fnIsDataTable=function(e){for(var h=j.settings,m=0;m<h.length;m++)if(h[m].nTable===e||h[m].nScrollHead===e||h[m].nScrollFoot===e)return!0;return!1};j.fnTables=function(e){var o=[];jQuery.each(j.settings,function(j,k){(!e||!0===e&&h(k.nTable).is(":visible"))&&o.push(k.nTable)});return o};j.version="1.9.4";j.settings=[];j.models={};j.models.ext={afnFiltering:[],afnSortData:[],aoFeatures:[],
aTypes:[],fnVersionCheck:j.fnVersionCheck,iApiIndex:0,ofnSearch:{},oApi:{},oStdClasses:{},oJUIClasses:{},oPagination:{},oSort:{},sVersion:j.version,sErrMode:"alert",_oExternConfig:{iNextUnique:0}};j.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};j.models.oRow={nTr:null,_aData:[],_aSortData:[],_anHidden:[],_sRowStripe:""};j.models.oColumn={aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bUseRendered:null,bVisible:null,_bAutoType:!0,fnCreatedCell:null,fnGetData:null,
fnRender:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};j.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,
bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollAutoCss:!0,bScrollCollapse:!1,bScrollInfinite:!1,bServerSide:!1,bSort:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCookieCallback:null,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(e){if(1E3>e)return e;for(var h=e+"",e=h.split(""),j="",h=h.length,k=0;k<h;k++)0===k%3&&0!==k&&(j=this.oLanguage.sInfoThousands+j),j=e[h-k-1]+j;return j},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,
fnRowCallback:null,fnServerData:function(e,j,m,k){k.jqXHR=h.ajax({url:e,data:j,success:function(e){e.sError&&k.oApi._fnLog(k,0,e.sError);h(k.oInstance).trigger("xhr",[k,e]);m(e)},dataType:"json",cache:!1,type:k.sServerMethod,error:function(e,h){"parsererror"==h&&k.oApi._fnLog(k,0,"DataTables warning: JSON data from server could not be parsed. This is caused by a JSON formatting error.")}})},fnServerParams:null,fnStateLoad:function(e){var e=this.oApi._fnReadCookie(e.sCookiePrefix+e.sInstance),j;try{j=
"function"===typeof h.parseJSON?h.parseJSON(e):eval("("+e+")")}catch(m){j=null}return j},fnStateLoadParams:null,fnStateLoaded:null,fnStateSave:function(e,h){this.oApi._fnCreateCookie(e.sCookiePrefix+e.sInstance,this.oApi._fnJsonString(h),e.iCookieDuration,e.sCookiePrefix,e.fnCookieCallback)},fnStateSaveParams:null,iCookieDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iScrollLoadGap:100,iTabIndex:0,oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},
oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sInfoThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"No matching records found"},oSearch:h.extend({},j.models.oSearch),sAjaxDataProp:"aaData",
sAjaxSource:null,sCookiePrefix:"SpryMedia_DataTables_",sDom:"lfrtip",sPaginationType:"two_button",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET"};j.defaults.columns={aDataSort:null,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bUseRendered:!0,bVisible:!0,fnCreatedCell:null,fnRender:null,iDataSort:-1,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};j.models.oSettings={oFeatures:{bAutoWidth:null,
bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortClasses:null,bStateSave:null},oScroll:{bAutoCss:null,bCollapse:null,bInfinite:null,iBarWidth:0,iLoadGap:null,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1},aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],asDataSearch:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:null,
asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iCookieDuration:0,sCookiePrefix:"",fnCookieCallback:null,aoStateSave:[],aoStateLoad:[],
oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iDisplayEnd:10,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsTotal,10):this.aiDisplayMaster.length},
fnRecordsDisplay:function(){return this.oFeatures.bServerSide?parseInt(this._iRecordsDisplay,10):this.aiDisplay.length},fnDisplayEnd:function(){return this.oFeatures.bServerSide?!1===this.oFeatures.bPaginate||-1==this._iDisplayLength?this._iDisplayStart+this.aiDisplay.length:Math.min(this._iDisplayStart+this._iDisplayLength,this._iRecordsDisplay):this._iDisplayEnd},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null};j.ext=h.extend(!0,{},j.models.ext);h.extend(j.ext.oStdClasses,
{sTable:"dataTable",sPagePrevEnabled:"paginate_enabled_previous",sPagePrevDisabled:"paginate_disabled_previous",sPageNextEnabled:"paginate_enabled_next",sPageNextDisabled:"paginate_disabled_next",sPageJUINext:"",sPageJUIPrev:"",sPageButton:"paginate_button",sPageButtonActive:"paginate_active",sPageButtonStaticDisabled:"paginate_button paginate_button_disabled",sPageFirst:"first",sPagePrevious:"previous",sPageNext:"next",sPageLast:"last",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",
sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",
sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sFooterTH:"",sJUIHeader:"",sJUIFooter:""});h.extend(j.ext.oJUIClasses,j.ext.oStdClasses,{sPagePrevEnabled:"fg-button ui-button ui-state-default ui-corner-left",sPagePrevDisabled:"fg-button ui-button ui-state-default ui-corner-left ui-state-disabled",sPageNextEnabled:"fg-button ui-button ui-state-default ui-corner-right",
sPageNextDisabled:"fg-button ui-button ui-state-default ui-corner-right ui-state-disabled",sPageJUINext:"ui-icon ui-icon-circle-arrow-e",sPageJUIPrev:"ui-icon ui-icon-circle-arrow-w",sPageButton:"fg-button ui-button ui-state-default",sPageButtonActive:"fg-button ui-button ui-state-default ui-state-disabled",sPageButtonStaticDisabled:"fg-button ui-button ui-state-default ui-state-disabled",sPageFirst:"first ui-corner-tl ui-corner-bl",sPageLast:"last ui-corner-tr ui-corner-br",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",
sSortAsc:"ui-state-default",sSortDesc:"ui-state-default",sSortable:"ui-state-default",sSortableAsc:"ui-state-default",sSortableDesc:"ui-state-default",sSortableNone:"ui-state-default",sSortJUIAsc:"css_right ui-icon ui-icon-triangle-1-n",sSortJUIDesc:"css_right ui-icon ui-icon-triangle-1-s",sSortJUI:"css_right ui-icon ui-icon-carat-2-n-s",sSortJUIAscAllowed:"css_right ui-icon ui-icon-carat-1-n",sSortJUIDescAllowed:"css_right ui-icon ui-icon-carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",
sScrollHead:"dataTables_scrollHead ui-state-default",sScrollFoot:"dataTables_scrollFoot ui-state-default",sFooterTH:"ui-state-default",sJUIHeader:"fg-toolbar ui-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix",sJUIFooter:"fg-toolbar ui-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix"});h.extend(j.ext.oPagination,{two_button:{fnInit:function(e,j,m){var k=e.oLanguage.oPaginate,n=function(h){e.oApi._fnPageChange(e,h.data.action)&&m(e)},k=!e.bJUI?'<a class="'+
e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sPrevious+'</a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button">'+k.sNext+"</a>":'<a class="'+e.oClasses.sPagePrevDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUIPrev+'"></span></a><a class="'+e.oClasses.sPageNextDisabled+'" tabindex="'+e.iTabIndex+'" role="button"><span class="'+e.oClasses.sPageJUINext+'"></span></a>';h(j).append(k);var l=h("a",j),
k=l[0],l=l[1];e.oApi._fnBindAction(k,{action:"previous"},n);e.oApi._fnBindAction(l,{action:"next"},n);e.aanFeatures.p||(j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_previous",l.id=e.sTableId+"_next",k.setAttribute("aria-controls",e.sTableId),l.setAttribute("aria-controls",e.sTableId))},fnUpdate:function(e){if(e.aanFeatures.p)for(var h=e.oClasses,j=e.aanFeatures.p,k,l=0,n=j.length;l<n;l++)if(k=j[l].firstChild)k.className=0===e._iDisplayStart?h.sPagePrevDisabled:h.sPagePrevEnabled,k=k.nextSibling,
k.className=e.fnDisplayEnd()==e.fnRecordsDisplay()?h.sPageNextDisabled:h.sPageNextEnabled}},iFullNumbersShowPages:5,full_numbers:{fnInit:function(e,j,m){var k=e.oLanguage.oPaginate,l=e.oClasses,n=function(h){e.oApi._fnPageChange(e,h.data.action)&&m(e)};h(j).append('<a  tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPageFirst+'">'+k.sFirst+'</a><a  tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPagePrevious+'">'+k.sPrevious+'</a><span></span><a tabindex="'+e.iTabIndex+'" class="'+
l.sPageButton+" "+l.sPageNext+'">'+k.sNext+'</a><a tabindex="'+e.iTabIndex+'" class="'+l.sPageButton+" "+l.sPageLast+'">'+k.sLast+"</a>");var t=h("a",j),k=t[0],l=t[1],r=t[2],t=t[3];e.oApi._fnBindAction(k,{action:"first"},n);e.oApi._fnBindAction(l,{action:"previous"},n);e.oApi._fnBindAction(r,{action:"next"},n);e.oApi._fnBindAction(t,{action:"last"},n);e.aanFeatures.p||(j.id=e.sTableId+"_paginate",k.id=e.sTableId+"_first",l.id=e.sTableId+"_previous",r.id=e.sTableId+"_next",t.id=e.sTableId+"_last")},
fnUpdate:function(e,o){if(e.aanFeatures.p){var m=j.ext.oPagination.iFullNumbersShowPages,k=Math.floor(m/2),l=Math.ceil(e.fnRecordsDisplay()/e._iDisplayLength),n=Math.ceil(e._iDisplayStart/e._iDisplayLength)+1,t="",r,B=e.oClasses,u,M=e.aanFeatures.p,L=function(h){e.oApi._fnBindAction(this,{page:h+r-1},function(h){e.oApi._fnPageChange(e,h.data.page);o(e);h.preventDefault()})};-1===e._iDisplayLength?n=k=r=1:l<m?(r=1,k=l):n<=k?(r=1,k=m):n>=l-k?(r=l-m+1,k=l):(r=n-Math.ceil(m/2)+1,k=r+m-1);for(m=r;m<=k;m++)t+=
n!==m?'<a tabindex="'+e.iTabIndex+'" class="'+B.sPageButton+'">'+e.fnFormatNumber(m)+"</a>":'<a tabindex="'+e.iTabIndex+'" class="'+B.sPageButtonActive+'">'+e.fnFormatNumber(m)+"</a>";m=0;for(k=M.length;m<k;m++)u=M[m],u.hasChildNodes()&&(h("span:eq(0)",u).html(t).children("a").each(L),u=u.getElementsByTagName("a"),u=[u[0],u[1],u[u.length-2],u[u.length-1]],h(u).removeClass(B.sPageButton+" "+B.sPageButtonActive+" "+B.sPageButtonStaticDisabled),h([u[0],u[1]]).addClass(1==n?B.sPageButtonStaticDisabled:
B.sPageButton),h([u[2],u[3]]).addClass(0===l||n===l||-1===e._iDisplayLength?B.sPageButtonStaticDisabled:B.sPageButton))}}}});h.extend(j.ext.oSort,{"string-pre":function(e){"string"!=typeof e&&(e=null!==e&&e.toString?e.toString():"");return e.toLowerCase()},"string-asc":function(e,h){return e<h?-1:e>h?1:0},"string-desc":function(e,h){return e<h?1:e>h?-1:0},"html-pre":function(e){return e.replace(/<.*?>/g,"").toLowerCase()},"html-asc":function(e,h){return e<h?-1:e>h?1:0},"html-desc":function(e,h){return e<
h?1:e>h?-1:0},"date-pre":function(e){e=Date.parse(e);if(isNaN(e)||""===e)e=Date.parse("01/01/1970 00:00:00");return e},"date-asc":function(e,h){return e-h},"date-desc":function(e,h){return h-e},"numeric-pre":function(e){return"-"==e||""===e?0:1*e},"numeric-asc":function(e,h){return e-h},"numeric-desc":function(e,h){return h-e}});h.extend(j.ext.aTypes,[function(e){if("number"===typeof e)return"numeric";if("string"!==typeof e)return null;var h,j=!1;h=e.charAt(0);if(-1=="0123456789-".indexOf(h))return null;
for(var k=1;k<e.length;k++){h=e.charAt(k);if(-1=="0123456789.".indexOf(h))return null;if("."==h){if(j)return null;j=!0}}return"numeric"},function(e){var h=Date.parse(e);return null!==h&&!isNaN(h)||"string"===typeof e&&0===e.length?"date":null},function(e){return"string"===typeof e&&-1!=e.indexOf("<")&&-1!=e.indexOf(">")?"html":null}]);h.fn.DataTable=j;h.fn.dataTable=j;h.fn.dataTableSettings=j.settings;h.fn.dataTableExt=j.ext};"function"===typeof define&&define.amd?define(["jquery"],L):jQuery&&!jQuery.fn.dataTable&&
L(jQuery)})(window,document);
/**
  Write me...
 
  @class AnimatedContainerView
  @namespace Ember
  @extends Ember.ContainerView
*/

Ember.AnimatedContainerView = Ember.ContainerView.extend({

    classNames: ['ember-animated-container'],
    
    init: function() {
        this._super();
        //Register this view, so queued effects can be related with this view by name
        Ember.AnimatedContainerView._views[this.get('name')] = this;
        this._isAnimating = false;
    },
    
    willDestroy: function() {
        this._super();
        //Clean up
        var name = this.get('name');
        delete Ember.AnimatedContainerView._views[name];
        delete Ember.AnimatedContainerView._animationQueue[name];
    },
    
    //Override parent method
    _currentViewWillChange: Ember.beforeObserver(function() {
        var currentView = Ember.get(this, 'currentView');
        if (currentView) {
            //Store the old `currentView` (and don't destroy it yet) so we can use it for animation later
            this.set('oldView', currentView);
        }
    }, 'currentView'),

    _currentViewDidChange: Ember.observer(function() {
        var newView = Ember.get(this, 'currentView'),
            oldView = Ember.get(this, 'oldView'),
            name = this.get('name'),
            effect = null;
        if (newView) {
            if (oldView) {
                Ember.assert('Ember.AnimatedContainerView can only animate non-virtual views. You need to explicitly define your view class.', !oldView.isVirtual);
                Ember.assert('Ember.AnimatedContainerView can only animate non-virtual views. You need to explicitly define your view class.', !newView.isVirtual);
                //Get and validate a potentially queued effect
                effect = Ember.AnimatedContainerView._animationQueue[name];
                delete Ember.AnimatedContainerView._animationQueue[name];
                if (effect && !Ember.AnimatedContainerView._effects[effect]) {
                    Ember.warn('Unknown animation effect: '+effect);
                    effect = null;
                }
                //Forget about the old view
                this.set('oldView', null);
            }
            //If there is already an animation queued, we should cancel it
            if (this._queuedAnimation) {
                oldView.destroy(); //the oldView has never been visible, and never will be, so we can just destroy it now
                oldView = this._queuedAnimation.oldView; //instead, use the oldView from the queued animation, which is our real currentView
            }
            //Queue this animation and check the queue
            this._queuedAnimation = {
                newView: newView,
                oldView: oldView,
                effect: effect
            };
            this._handleAnimationQueue();
        }
    }, 'currentView'),

    _handleAnimationQueue: function() {
        //If animation is in progress, just stop here. Once the animation has finished, this method will be called again.
        if (this._isAnimating) {
            return;
        }
        var self = this,
            q = this._queuedAnimation;
        if (q) {
            var newView = q.newView,
                oldView = q.oldView,
                effect = q.effect;
            this._queuedAnimation = null;
            //Push the newView to this view, which will append it to the DOM
            this.pushObject(newView);
            if (oldView && effect) {
                //If an effect is queued, then start the effect when the new view has been inserted in the DOM
                this._isAnimating = true;
                newView.on('didInsertElement', function() {
                    Ember.AnimatedContainerView._effects[effect](self, newView, oldView, function() {
                        self.removeObject(oldView);
                        oldView.destroy();
                        //Check to see if there are any queued animations
                        self._isAnimating = false;
                        self._handleAnimationQueue();
                    });
                });
            } else {
                if (oldView) {
                    //If there is no effect queued, then just remove the old view (as would normally happen in a ContainerView)
                    this.removeObject(oldView);
                    oldView.destroy();
                }
            }
        }
    },

    enqueueAnimation: function(effect) {
        Ember.AnimatedContainerView._animationQueue[this.get('name')] = effect;
    },
    
    setCurrentViewAnimated: function(currentView, effect) {
        this.enqueueAnimation(effect);
        this.set('currentView', currentView);
    }

});

Ember.AnimatedContainerView.reopenClass({
    
    /**
      All animated outlets registers itself in this hash
       
      @private
      @property {Object} _views
    */
    _views: {},

    /**
      Whenever an animated route transition is set in motion, it will be stored here, so the animated outlet view can pick it up

      @private
      @property {Object} _animationQueue
    */
    _animationQueue: {},

    /**
      Enqueue effects to be executed by the given outlets when the next route transition happens.
      
      @param {Object} animations A hash with keys corresponding to outlet views and values with the desired animation effect.
    */
    enqueueAnimations: function(animations) {
        for (var name in animations) {
            if (!animations.hasOwnProperty(name)) continue;
            this._animationQueue[name] = animations[name];
        }
    },

    /**
      All animation effects are stored on this object and can be referred to by its key

      @private
      @property {Object} effects
    */
    _effects: {},


    /**
      Register a new effect.
     
      The `callback` function will be passed the following parameters:
     
      - The `Ember.AnimatedContainerView` instance.
      - The new view.
      - The old view.

      @param {String} effect The name of the effect, e.g. 'slideLeft'
      @param {Function} callback The function to call when effect has to be executed
    */
    registerEffect: function(effect, callback) {
        this._effects[effect] = callback;
    }

});
/**
  Write me...

  Straight-up stolen from `Handlebars.registerHelper('outlet', ...);`

  @method outlet
  @for Ember.Handlebars.helpers
  @param {String} property the property on the controller that holds the view for this outlet
*/
Handlebars.registerHelper('animatedOutlet', function(property, options) {
    var outletSource;

    if (property && property.data && property.data.isRenderData) {
        options = property;
        property = 'main';
    }

    outletSource = options.data.view;
    while (!(outletSource.get('template.isTop'))){
        outletSource = outletSource.get('_parentView');
    }

    options.data.view.set('outletSource', outletSource);
    options.hash.currentViewBinding = '_view.outletSource._outlets.' + property;

    //Only this line has been changed
    return Ember.Handlebars.helpers.view.call(this, Ember.AnimatedContainerView, options);
});

/**
@module ember
@submodule ember-routing
*/

var get = Ember.get, set = Ember.set;

Ember.onLoad('Ember.Handlebars', function(Handlebars) {
  var resolveParams = Ember.Router.resolveParams,
      isSimpleClick = Ember.ViewUtils.isSimpleClick;

  function fullRouteName(router, name) {
    if (!router.hasRoute(name)) {
      name = name + '.index';
    }

    return name;
  }

  function resolvedPaths(options) {
    var types = options.options.types.slice(1),
        data = options.options.data;

    return resolveParams(options.context, options.params, { types: types, data: data });
  }

  function args(linkView, router, route) {
    var passedRouteName = route || linkView.namedRoute, routeName;

    routeName = fullRouteName(router, passedRouteName);
    Ember.assert("The route " + passedRouteName + " was not found", router.hasRoute(routeName));

    var ret = [ routeName ];

    animations = linkView.parameters.animations;

    return ret.concat(animations, resolvedPaths(linkView.parameters));
  }


  /**
    Renders a link to the supplied route using animation.

    @class AnimatedLinkView
    @namespace Ember
    @extends Ember.LinkView
  **/
  var AnimatedLinkView = Ember.AnimatedLinkView = Ember.LinkView.extend({
    click: function(event) {
      if (!isSimpleClick(event)) { return true; }

      event.preventDefault();
      if (this.bubbles === false) { event.stopPropagation(); }

      var router = this.get('router');
      var route = this.get('container').lookup('route:' + this.get('namedRoute'));

      if (this.get('replace')) {
        route.replaceWithAnimated.apply(router, args(this, router));
      } else {
        route.transitionToAnimated.apply(router, args(this, router));
      }
    }
  });

  AnimatedLinkView.toString = function() { return "AnimatedLinkView"; };

  /**
    @method linkToAnimated
    @for Ember.Handlebars.helpers
    @param {String} routeName
    @param {Object} [context]*
    @return {String} HTML string
  */
  Ember.Handlebars.registerHelper('linkToAnimated', function(name) {
    var options = [].slice.call(arguments, -1)[0];
    var params = [].slice.call(arguments, 1, -1);
    var hash = options.hash;

    Ember.assert("linkToAnimated must contain animations", typeof(hash.animations) == 'string')
    var re = /\s*([a-z]+)\s*:\s*([a-z]+)/gi;
    var animations = {};
    while (match = re.exec(hash.animations)) {
      animations[match[1]] = match[2];
    }
    delete(hash.animations)
    hash.namedRoute = name;
    hash.currentWhen = hash.currentWhen || name;

    hash.parameters = {
      context: this,
      options: options,
      animations: animations,
      params: params
    };

    return Ember.Handlebars.helpers.view.call(this, AnimatedLinkView, options);
  });

});


Ember.Route.reopen({

    /**
      Works as {@link Ember.Route.transitionTo}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    transitionToAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.transitionTo.apply(this, arguments);
    },

    /**
      Works as {@link Ember.Route.replaceWith}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    replaceWithAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.replaceWith.apply(this, arguments);
    }

});
Ember.ControllerMixin.reopen({

    /**
      Works as {@link Ember.ControllerMixin.transitionToRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.
     
      `animations` should be an object with outlet names as keys and effect names as value.
     
      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    transitionToRouteAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.transitionToRoute.apply(this, arguments);
    },

    /**
      Works as {@link Ember.ControllerMixin.replaceRoute}} except that it takes a third parameter, `animations`,
      which will enqueue animations.

      `animations` should be an object with outlet names as keys and effect names as value.

      @param name
      @param animations {Object} Animations to enqueue
      @param model
    */
    replaceRouteAnimated: function(name, animations, model) {
        Ember.AnimatedContainerView.enqueueAnimations(animations);
        Array.prototype.splice.call(arguments, 1, 1);
        return this.replaceRoute.apply(this, arguments);
    }

});
Ember.AnimatedContainerView.registerEffect('fade', function(ct, newView, oldView, callback) {
    var newEl = newView.$(),
        oldEl = oldView.$();
    newEl.addClass('ember-animated-container-fade-new');
    oldEl.addClass('ember-animated-container-fade-old');
    setTimeout(function() {
        oldEl.addClass('ember-animated-container-fade-old-fading');
        setTimeout(function() {
            newEl.removeClass('ember-animated-container-fade-new');
            callback();
        }, 550);
    }, 0);
});
Ember.AnimatedContainerView.registerEffect('flip', function(ct, newView, oldView, callback) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        oldEl = oldView.$();
    ctEl.wrap('<div class="ember-animated-container-flip-wrap"></div>')
    ctEl.addClass('ember-animated-container-flip-ct');
    newEl.addClass('ember-animated-container-flip-new');
    oldEl.addClass('ember-animated-container-flip-old');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-flip-ct-flipping');
        setTimeout(function() {
            ctEl.unwrap();
            ctEl.removeClass('ember-animated-container-flip-ct');
            ctEl.removeClass('ember-animated-container-flip-ct-flipping');
            newEl.removeClass('ember-animated-container-flip-new');
            callback();
        }, 650);
    }, 0);
});
(function() {
    
var slide = function(ct, newView, oldView, callback, direction, slow) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        duration = slow ? 2050 : 450;
    ctEl.addClass('ember-animated-container-slide-'+direction+'-ct')
    if (slow) {
        ctEl.addClass('ember-animated-container-slide-slow-ct')
    }
    newEl.addClass('ember-animated-container-slide-'+direction+'-new');
    setTimeout(function() {
        ctEl.addClass('ember-animated-container-slide-'+direction+'-ct-sliding');
        setTimeout(function() {
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct');
            if (slow) {
                ctEl.removeClass('ember-animated-container-slide-slow-ct')
            }
            ctEl.removeClass('ember-animated-container-slide-'+direction+'-ct-sliding');
            newEl.removeClass('ember-animated-container-slide-'+direction+'-new');
            callback();
        }, duration);
    }, 0);
};

Ember.AnimatedContainerView.registerEffect('slideLeft', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'left', false);
});

Ember.AnimatedContainerView.registerEffect('slideRight', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'right', false);
});

Ember.AnimatedContainerView.registerEffect('slideUp', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'up', false);
});

Ember.AnimatedContainerView.registerEffect('slideDown', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'down', false);
});

Ember.AnimatedContainerView.registerEffect('slowSlideLeft', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'left', true);
});
    
Ember.AnimatedContainerView.registerEffect('slowSlideRight', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'right', true);
});

Ember.AnimatedContainerView.registerEffect('slowSlideUp', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'up', false);
});

Ember.AnimatedContainerView.registerEffect('slowSlideDown', function(ct, newView, oldView, callback) {
    slide(ct, newView, oldView, callback, 'down', false);
});

})();
(function() {

var slideOver = function(ct, newView, oldView, callback, direction) {
    var ctEl = ct.$(),
        newEl = newView.$(),
        duration = 450;
    ctEl.addClass('ember-animated-container-slideOver-old');
    setTimeout(function() {
        newEl.addClass('ember-animated-container-slideOver-'+direction+'-new');
        newEl.addClass('ember-animated-container-slideOver-'+direction+'-new-sliding');
        setTimeout(function() {
            newEl.removeClass('ember-animated-container-slideOver-'+direction+'-new');
            newEl.removeClass('ember-animated-container-slideOver-'+direction+'-new-sliding');
            ctEl.removeClass('ember-animated-container-slideOver-old');
            callback();
        }, duration);
    }, 0);
};

Ember.AnimatedContainerView.registerEffect('slideOverLeft', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'left');
});

Ember.AnimatedContainerView.registerEffect('slideOverRight', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'right');
});

Ember.AnimatedContainerView.registerEffect('slideOverUp', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'up');
});

Ember.AnimatedContainerView.registerEffect('slideOverDown', function(ct, newView, oldView, callback) {
    slideOver(ct, newView, oldView, callback, 'down');
});

})();
// Last commit: 26c9b5c (2013-08-31 23:22:18 -0500)


(function() {
var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod, deps, callback, reified , exports;

    mod = registry[name];

    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    deps = mod.deps;
    callback = mod.callback;
    reified = [];
    exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();
(function() {
var get = Ember.get, set = Ember.set;

/**
@module ember
@submodule ember-states
*/

/**
  The State class allows you to define individual states within a finite state machine
  inside your Ember application.

  ### How States Work

  When you setup a finite state machine this means you are setting up a mechanism to precisely
  manage the change within a system. You can control the various states or modes that your 
  application can be in at any given time. Additionally, you can manage what specific states 
  are allowed to transition to other states.

  The state machine is in only one state at a time. This state is known as the current state. 
  It is possible to change from one state to another by a triggering event or condition. 
  This is called a transition. 

  Finite state machines are important because they allow the application developer to be 
  deterministic about the the sequence of events that can happen within a system. Some states
  cannot be entered when the application is a given state.

  For example:

  A door that is in the `locked` state cannot be `opened` (you must transition to the `unlocked`
  state first).

  A door that is in the `open` state cannot be `locked` (you must transition to the `closed` 
  state first).


  Each state instance has the following characteristics:

  - Zero or more parent states
  - A start state
  - A name
  - A path (a computed value that prefixes parent states and the complete hierarchy to itself ) 

  A state is known as a "leafState" when it is the last item on the path and has no children
  beneath it. 

  The isLeaf property returns a boolean.

  Each state can emit the following transition events

  - setup
  - enter
  - exit

  A state object is ususally created in the context of a state manager.

  ```javascript
  doorStateManager = Ember.StateManager.create({
    locked: Ember.State.create(),
    closed: Ember.State.create(),
    unlocked: Ember.State.create(),
    open: Ember.State.create()
  });
  ```
 
  @class State
  @namespace Ember
  @extends Ember.Object
  @uses Ember.Evented
*/
Ember.State = Ember.Object.extend(Ember.Evented,
/** @scope Ember.State.prototype */{
  /**
    A reference to the parent state.

    @property parentState
    @type Ember.State
  */
  parentState: null,
  start: null,

  /**
    The name of this state.

    @property name
    @type String
  */
  name: null,

  /**
    The full path to this state.

    @property path
    @type String
  */
  path: Ember.computed(function() {
    var parentPath = get(this, 'parentState.path'),
        path = get(this, 'name');

    if (parentPath) {
      path = parentPath + '.' + path;
    }

    return path;
  }),

  /**
    @private

    Override the default event firing from `Ember.Evented` to
    also call methods with the given name.

    @method trigger
    @param name
  */
  trigger: function(name) {
    if (this[name]) {
      this[name].apply(this, [].slice.call(arguments, 1));
    }
    this._super.apply(this, arguments);
  },

  /**
    Initialize Ember.State object
    Sets childStates to Ember.NativeArray
    Sets eventTransitions to empty object unless already defined.
    Loops over properties of this state and ensures that any property that
    is an instance of Ember.State is moved to `states` hash.
  

    @method init
  */
  init: function() {
    var states = get(this, 'states');
    set(this, 'childStates', Ember.A());
    set(this, 'eventTransitions', get(this, 'eventTransitions') || {});

    var name, value, transitionTarget;

    // As a convenience, loop over the properties
    // of this state and look for any that are other
    // Ember.State instances or classes, and move them
    // to the `states` hash. This avoids having to
    // create an explicit separate hash.

    if (!states) {
      states = {};

      for (name in this) {
        if (name === "constructor") { continue; }

        if (value = this[name]) {
          if (transitionTarget = value.transitionTarget) {
            this.eventTransitions[name] = transitionTarget;
          }

          this.setupChild(states, name, value);
        }
      }

      set(this, 'states', states);
    } else {
      for (name in states) {
        this.setupChild(states, name, states[name]);
      }
    }

    // pathsCaches is a nested hash of the form:
    //   pathsCaches[stateManagerTypeGuid][path] == transitions_hash
    set(this, 'pathsCaches', {});
  },

  /**
    Sets a cached instance of the state. Ember.guidFor is used
    to find the guid of the associated state manager. If a cache can be found 
    the state path is added to that cache, otherwise an empty JavaScript object 
    is created. And the state path is appended to that instead. 

    @method setPathsCache
    @param stateManager
    @param path
    @param transitions
  */
  setPathsCache: function(stateManager, path, transitions) {
    var stateManagerTypeGuid = Ember.guidFor(stateManager.constructor),
      pathsCaches = get(this, 'pathsCaches'),
      pathsCacheForManager = pathsCaches[stateManagerTypeGuid] || {};

    pathsCacheForManager[path] = transitions;
    pathsCaches[stateManagerTypeGuid] = pathsCacheForManager;
  },

  /**
    Returns a cached path for the state instance. Each state manager 
    has a GUID and this is used to look up a cached path if it has already
    been created. If a cached path is not found an empty JavaScript object
    is returned instead.

    @method getPathsCache
    @param stateManager
    @param path
  */
  getPathsCache: function(stateManager, path) {
    var stateManagerTypeGuid = Ember.guidFor(stateManager.constructor),
      pathsCaches = get(this, 'pathsCaches'),
      pathsCacheForManager = pathsCaches[stateManagerTypeGuid] || {};

    return pathsCacheForManager[path];
  },

  /**
    @private
  
    Create the child instance and ensure that it is an instance of Ember.State

    @method setupChild
    @param states
    @param name
    @param value
  */
  setupChild: function(states, name, value) {
    if (!value) { return false; }
    var instance;

    if (value instanceof Ember.State) {
      set(value, 'name', name);
      instance = value;
      instance.container = this.container;
    } else if (Ember.State.detect(value)) {
      instance = value.create({
        name: name,
        container: this.container
      });
    }

    if (instance instanceof Ember.State) {
      set(instance, 'parentState', this);
      get(this, 'childStates').pushObject(instance);
      states[name] = instance;
      return instance;
    }
  },

  /**
    @private
  
    @method lookupEventTransition
    @param name
  */
  lookupEventTransition: function(name) {
    var path, state = this;

    while(state && !path) {
      path = state.eventTransitions[name];
      state = state.get('parentState');
    }

    return path;
  },

  /**
    A Boolean value indicating whether the state is a leaf state
    in the state hierarchy. This is `false` if the state has child
    states; otherwise it is true.

    @property isLeaf
    @type Boolean
  */
  isLeaf: Ember.computed(function() {
    return !get(this, 'childStates').length;
  }),

  /**
    A boolean value indicating whether the state takes a context.
    By default we assume all states take contexts.

    @property hasContext
    @default true
  */
  hasContext: true,

  /**
    This is the default transition event.

    @event setup
    @param {Ember.StateManager} manager
    @param context
    @see Ember.StateManager#transitionEvent
  */
  setup: Ember.K,

  /**
    This event fires when the state is entered.

    @event enter
    @param {Ember.StateManager} manager
  */
  enter: Ember.K,

  /**
    This event fires when the state is exited.

    @event exit
    @param {Ember.StateManager} manager
  */
  exit: Ember.K
});

Ember.State.reopenClass({

  /**
    Creates an action function for transitioning to the named state while
    preserving context.

    The following example StateManagers are equivalent:

    ```javascript
    aManager = Ember.StateManager.create({
      stateOne: Ember.State.create({
        changeToStateTwo: Ember.State.transitionTo('stateTwo')
      }),
      stateTwo: Ember.State.create({})
    })

    bManager = Ember.StateManager.create({
      stateOne: Ember.State.create({
        changeToStateTwo: function(manager, context) {
          manager.transitionTo('stateTwo', context)
        }
      }),
      stateTwo: Ember.State.create({})
    })
    ```

    @method transitionTo
    @static
    @param {String} target
  */

  transitionTo: function(target) {

    var transitionFunction = function(stateManager, contextOrEvent) {
      var contexts = [],
          Event = Ember.$ && Ember.$.Event;

      if (contextOrEvent && (Event && contextOrEvent instanceof Event)) {
        if (contextOrEvent.hasOwnProperty('contexts')) {
          contexts = contextOrEvent.contexts.slice();
        }
      }
      else {
        contexts = [].slice.call(arguments, 1);
      }

      contexts.unshift(target);
      stateManager.transitionTo.apply(stateManager, contexts);
    };

    transitionFunction.transitionTarget = target;

    return transitionFunction;
  }

});

})();



(function() {
/**
@module ember
@submodule ember-states
*/

var get = Ember.get, set = Ember.set, fmt = Ember.String.fmt;
var arrayForEach = Ember.ArrayPolyfills.forEach;
/**
  A Transition takes the enter, exit and resolve states and normalizes
  them:

  * takes any passed in contexts into consideration
  * adds in `initialState`s

  @class Transition
  @private
*/
var Transition = function(raw) {
  this.enterStates = raw.enterStates.slice();
  this.exitStates = raw.exitStates.slice();
  this.resolveState = raw.resolveState;

  this.finalState = raw.enterStates[raw.enterStates.length - 1] || raw.resolveState;
};

Transition.prototype = {
  /**
    Normalize the passed in enter, exit and resolve states.

    This process also adds `finalState` and `contexts` to the Transition object.

    @method normalize
    @param {Ember.StateManager} manager the state manager running the transition
    @param {Array} contexts a list of contexts passed into `transitionTo`
  */
  normalize: function(manager, contexts) {
    this.matchContextsToStates(contexts);
    this.addInitialStates();
    this.removeUnchangedContexts(manager);
    return this;
  },

  /**
    Match each of the contexts passed to `transitionTo` to a state.
    This process may also require adding additional enter and exit
    states if there are more contexts than enter states.

    @method matchContextsToStates
    @param {Array} contexts a list of contexts passed into `transitionTo`
  */
  matchContextsToStates: function(contexts) {
    var stateIdx = this.enterStates.length - 1,
        matchedContexts = [],
        state,
        context;

    // Next, we will match the passed in contexts to the states they
    // represent.
    //
    // First, assign a context to each enter state in reverse order. If
    // any contexts are left, add a parent state to the list of states
    // to enter and exit, and assign a context to the parent state.
    //
    // If there are still contexts left when the state manager is
    // reached, raise an exception.
    //
    // This allows the following:
    //
    // |- root
    // | |- post
    // | | |- comments
    // | |- about (* current state)
    //
    // For `transitionTo('post.comments', post, post.get('comments')`,
    // the first context (`post`) will be assigned to `root.post`, and
    // the second context (`post.get('comments')`) will be assigned
    // to `root.post.comments`.
    //
    // For the following:
    //
    // |- root
    // | |- post
    // | | |- index (* current state)
    // | | |- comments
    //
    // For `transitionTo('post.comments', otherPost, otherPost.get('comments')`,
    // the `<root.post>` state will be added to the list of enter and exit
    // states because its context has changed.

    while (contexts.length > 0) {
      if (stateIdx >= 0) {
        state = this.enterStates[stateIdx--];
      } else {
        if (this.enterStates.length) {
          state = get(this.enterStates[0], 'parentState');
          if (!state) { throw "Cannot match all contexts to states"; }
        } else {
          // If re-entering the current state with a context, the resolve
          // state will be the current state.
          state = this.resolveState;
        }

        this.enterStates.unshift(state);
        this.exitStates.unshift(state);
      }

      // in routers, only states with dynamic segments have a context
      if (get(state, 'hasContext')) {
        context = contexts.pop();
      } else {
        context = null;
      }

      matchedContexts.unshift(context);
    }

    this.contexts = matchedContexts;
  },

  /**
    Add any `initialState`s to the list of enter states.

    @method addInitialStates
  */
  addInitialStates: function() {
    var finalState = this.finalState, initialState;

    while(true) {
      initialState = get(finalState, 'initialState') || 'start';
      finalState = get(finalState, 'states.' + initialState);

      if (!finalState) { break; }

      this.finalState = finalState;
      this.enterStates.push(finalState);
      this.contexts.push(undefined);
    }
  },

  /**
    Remove any states that were added because the number of contexts
    exceeded the number of explicit enter states, but the context has
    not changed since the last time the state was entered.

    @method removeUnchangedContexts
    @param {Ember.StateManager} manager passed in to look up the last
      context for a state
  */
  removeUnchangedContexts: function(manager) {
    // Start from the beginning of the enter states. If the state was added
    // to the list during the context matching phase, make sure the context
    // has actually changed since the last time the state was entered.
    while (this.enterStates.length > 0) {
      if (this.enterStates[0] !== this.exitStates[0]) { break; }

      if (this.enterStates.length === this.contexts.length) {
        if (manager.getStateMeta(this.enterStates[0], 'context') !== this.contexts[0]) { break; }
        this.contexts.shift();
      }

      this.resolveState = this.enterStates.shift();
      this.exitStates.shift();
    }
  }
};


/**
  Sends the event to the currentState, if the event is not handled this method 
  will proceed to call the parentState recursively until it encounters an 
  event handler or reaches the top or root of the state path hierarchy.

  @method sendRecursively
  @param event
  @param currentState
  @param isUnhandledPass
*/
var sendRecursively = function(event, currentState, isUnhandledPass) {
  var log = this.enableLogging,
      eventName = isUnhandledPass ? 'unhandledEvent' : event,
      action = currentState[eventName],
      contexts, sendRecursiveArguments, actionArguments;

  contexts = [].slice.call(arguments, 3);

  // Test to see if the action is a method that
  // can be invoked. Don't blindly check just for
  // existence, because it is possible the state
  // manager has a child state of the given name,
  // and we should still raise an exception in that
  // case.
  if (typeof action === 'function') {
    if (log) {
      if (isUnhandledPass) {
        Ember.Logger.log(fmt("STATEMANAGER: Unhandled event '%@' being sent to state %@.", [event, get(currentState, 'path')]));
      } else {
        Ember.Logger.log(fmt("STATEMANAGER: Sending event '%@' to state %@.", [event, get(currentState, 'path')]));
      }
    }

    actionArguments = contexts;
    if (isUnhandledPass) {
      actionArguments.unshift(event);
    }
    actionArguments.unshift(this);

    return action.apply(currentState, actionArguments);
  } else {
    var parentState = get(currentState, 'parentState');
    if (parentState) {

      sendRecursiveArguments = contexts;
      sendRecursiveArguments.unshift(event, parentState, isUnhandledPass);

      return sendRecursively.apply(this, sendRecursiveArguments);
    } else if (!isUnhandledPass) {
      return sendEvent.call(this, event, contexts, true);
    }
  }
};

/**
  Send an event to the currentState.
  
  @method sendEvent
  @param eventName
  @param sendRecursiveArguments
  @param isUnhandledPass
*/
var sendEvent = function(eventName, sendRecursiveArguments, isUnhandledPass) {
  sendRecursiveArguments.unshift(eventName, get(this, 'currentState'), isUnhandledPass);
  return sendRecursively.apply(this, sendRecursiveArguments);
};

/**
  StateManager is part of Ember's implementation of a finite state machine. A
  StateManager instance manages a number of properties that are instances of
  `Ember.State`,
  tracks the current active state, and triggers callbacks when states have changed.

  ## Defining States

  The states of StateManager can be declared in one of two ways. First, you can
  define a `states` property that contains all the states:

  ```javascript
  var managerA = Ember.StateManager.create({
    states: {
      stateOne: Ember.State.create(),
      stateTwo: Ember.State.create()
    }
  });

  managerA.get('states');
  // {
  //   stateOne: Ember.State.create(),
  //   stateTwo: Ember.State.create()
  // }
  ```

  You can also add instances of `Ember.State` (or an `Ember.State` subclass)
  directly as properties of a StateManager. These states will be collected into
  the `states` property for you.

  ```javascript
  var managerA = Ember.StateManager.create({
    stateOne: Ember.State.create(),
    stateTwo: Ember.State.create()
  });

  managerA.get('states');
  // {
  //   stateOne: Ember.State.create(),
  //   stateTwo: Ember.State.create()
  // }
  ```

  ## The Initial State

  When created, a StateManager instance will immediately enter into the state
  defined as its `start` property or the state referenced by name in its
  `initialState` property:

  ```javascript
  var managerA = Ember.StateManager.create({
    start: Ember.State.create({})
  });

  managerA.get('currentState.name'); // 'start'

  var managerB = Ember.StateManager.create({
    initialState: 'beginHere',
    beginHere: Ember.State.create({})
  });

  managerB.get('currentState.name'); // 'beginHere'
  ```

  Because it is a property you may also provide a computed function if you wish
  to derive an `initialState` programmatically:

  ```javascript
  var managerC = Ember.StateManager.create({
    initialState: function() {
      if (someLogic) {
        return 'active';
      } else {
        return 'passive';
      }
    }.property(),
    active: Ember.State.create({}),
    passive: Ember.State.create({})
  });
  ```

  ## Moving Between States

  A StateManager can have any number of `Ember.State` objects as properties
  and can have a single one of these states as its current state.

  Calling `transitionTo` transitions between states:

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown',
    poweredDown: Ember.State.create({}),
    poweredUp: Ember.State.create({})
  });

  robotManager.get('currentState.name'); // 'poweredDown'
  robotManager.transitionTo('poweredUp');
  robotManager.get('currentState.name'); // 'poweredUp'
  ```

  Before transitioning into a new state the existing `currentState` will have
  its `exit` method called with the StateManager instance as its first argument
  and an object representing the transition as its second argument.

  After transitioning into a new state the new `currentState` will have its
  `enter` method called with the StateManager instance as its first argument
  and an object representing the transition as its second argument.

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown',
    poweredDown: Ember.State.create({
      exit: function(stateManager) {
        console.log("exiting the poweredDown state")
      }
    }),
    poweredUp: Ember.State.create({
      enter: function(stateManager) {
        console.log("entering the poweredUp state. Destroy all humans.")
      }
    })
  });

  robotManager.get('currentState.name'); // 'poweredDown'
  robotManager.transitionTo('poweredUp');

  // will log
  // 'exiting the poweredDown state'
  // 'entering the poweredUp state. Destroy all humans.'
  ```

  Once a StateManager is already in a state, subsequent attempts to enter that
  state will not trigger enter or exit method calls. Attempts to transition
  into a state that the manager does not have will result in no changes in the
  StateManager's current state:

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown',
    poweredDown: Ember.State.create({
      exit: function(stateManager) {
        console.log("exiting the poweredDown state")
      }
    }),
    poweredUp: Ember.State.create({
      enter: function(stateManager) {
        console.log("entering the poweredUp state. Destroy all humans.")
      }
    })
  });

  robotManager.get('currentState.name'); // 'poweredDown'
  robotManager.transitionTo('poweredUp');
  // will log
  // 'exiting the poweredDown state'
  // 'entering the poweredUp state. Destroy all humans.'
  robotManager.transitionTo('poweredUp'); // no logging, no state change

  robotManager.transitionTo('someUnknownState'); // silently fails
  robotManager.get('currentState.name'); // 'poweredUp'
  ```

  Each state property may itself contain properties that are instances of
  `Ember.State`. The StateManager can transition to specific sub-states in a
  series of transitionTo method calls or via a single transitionTo with the
  full path to the specific state. The StateManager will also keep track of the
  full path to its currentState

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown',
    poweredDown: Ember.State.create({
      charging: Ember.State.create(),
      charged: Ember.State.create()
    }),
    poweredUp: Ember.State.create({
      mobile: Ember.State.create(),
      stationary: Ember.State.create()
    })
  });

  robotManager.get('currentState.name'); // 'poweredDown'

  robotManager.transitionTo('poweredUp');
  robotManager.get('currentState.name'); // 'poweredUp'

  robotManager.transitionTo('mobile');
  robotManager.get('currentState.name'); // 'mobile'

  // transition via a state path
  robotManager.transitionTo('poweredDown.charging');
  robotManager.get('currentState.name'); // 'charging'

  robotManager.get('currentState.path'); // 'poweredDown.charging'
  ```

  Enter transition methods will be called for each state and nested child state
  in their hierarchical order. Exit methods will be called for each state and
  its nested states in reverse hierarchical order.

  Exit transitions for a parent state are not called when entering into one of
  its child states, only when transitioning to a new section of possible states
  in the hierarchy.

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown',
    poweredDown: Ember.State.create({
      enter: function() {},
      exit: function() {
        console.log("exited poweredDown state")
      },
      charging: Ember.State.create({
        enter: function() {},
        exit: function() {}
      }),
      charged: Ember.State.create({
        enter: function() {
          console.log("entered charged state")
        },
        exit: function() {
          console.log("exited charged state")
        }
      })
    }),
    poweredUp: Ember.State.create({
      enter: function() {
        console.log("entered poweredUp state")
      },
      exit: function() {},
      mobile: Ember.State.create({
        enter: function() {
          console.log("entered mobile state")
        },
        exit: function() {}
      }),
      stationary: Ember.State.create({
        enter: function() {},
        exit: function() {}
      })
    })
  });


  robotManager.get('currentState.path'); // 'poweredDown'
  robotManager.transitionTo('charged');
  // logs 'entered charged state'
  // but does *not* log  'exited poweredDown state'
  robotManager.get('currentState.name'); // 'charged

  robotManager.transitionTo('poweredUp.mobile');
  // logs
  // 'exited charged state'
  // 'exited poweredDown state'
  // 'entered poweredUp state'
  // 'entered mobile state'
  ```

  During development you can set a StateManager's `enableLogging` property to
  `true` to receive console messages of state transitions.

  ```javascript
  var robotManager = Ember.StateManager.create({
    enableLogging: true
  });
  ```

  ## Managing currentState with Actions

  To control which transitions are possible for a given state, and
  appropriately handle external events, the StateManager can receive and
  route action messages to its states via the `send` method. Calling to
  `send` with an action name will begin searching for a method with the same
  name starting at the current state and moving up through the parent states
  in a state hierarchy until an appropriate method is found or the StateManager
  instance itself is reached.

  If an appropriately named method is found it will be called with the state
  manager as the first argument and an optional `context` object as the second
  argument.

  ```javascript
  var managerA = Ember.StateManager.create({
    initialState: 'stateOne.substateOne.subsubstateOne',
    stateOne: Ember.State.create({
      substateOne: Ember.State.create({
        anAction: function(manager, context) {
          console.log("an action was called")
        },
        subsubstateOne: Ember.State.create({})
      })
    })
  });

  managerA.get('currentState.name'); // 'subsubstateOne'
  managerA.send('anAction');
  // 'stateOne.substateOne.subsubstateOne' has no anAction method
  // so the 'anAction' method of 'stateOne.substateOne' is called
  // and logs "an action was called"
  // with managerA as the first argument
  // and no second argument

  var someObject = {};
  managerA.send('anAction', someObject);
  // the 'anAction' method of 'stateOne.substateOne' is called again
  // with managerA as the first argument and
  // someObject as the second argument.
  ```

  If the StateManager attempts to send an action but does not find an appropriately named
  method in the current state or while moving upwards through the state hierarchy, it will
  repeat the process looking for a `unhandledEvent` method. If an `unhandledEvent` method is
  found, it will be called with the original event name as the second argument. If an
  `unhandledEvent` method is not found, the StateManager will throw a new Ember.Error.

  ```javascript
  var managerB = Ember.StateManager.create({
    initialState: 'stateOne.substateOne.subsubstateOne',
    stateOne: Ember.State.create({
      substateOne: Ember.State.create({
        subsubstateOne: Ember.State.create({}),
        unhandledEvent: function(manager, eventName, context) {
          console.log("got an unhandledEvent with name " + eventName);
        }
      })
    })
  });

  managerB.get('currentState.name'); // 'subsubstateOne'
  managerB.send('anAction');
  // neither `stateOne.substateOne.subsubstateOne` nor any of it's
  // parent states have a handler for `anAction`. `subsubstateOne`
  // also does not have a `unhandledEvent` method, but its parent
  // state, `substateOne`, does, and it gets fired. It will log
  // "got an unhandledEvent with name anAction"
  ```

  Action detection only moves upwards through the state hierarchy from the current state.
  It does not search in other portions of the hierarchy.

  ```javascript
  var managerC = Ember.StateManager.create({
    initialState: 'stateOne.substateOne.subsubstateOne',
    stateOne: Ember.State.create({
      substateOne: Ember.State.create({
        subsubstateOne: Ember.State.create({})
      })
    }),
    stateTwo: Ember.State.create({
      anAction: function(manager, context) {
        // will not be called below because it is
        // not a parent of the current state
      }
    })
  });

  managerC.get('currentState.name'); // 'subsubstateOne'
  managerC.send('anAction');
  // Error: <Ember.StateManager:ember132> could not
  // respond to event anAction in state stateOne.substateOne.subsubstateOne.
  ```

  Inside of an action method the given state should delegate `transitionTo` calls on its
  StateManager.

  ```javascript
  var robotManager = Ember.StateManager.create({
    initialState: 'poweredDown.charging',
    poweredDown: Ember.State.create({
      charging: Ember.State.create({
        chargeComplete: function(manager, context) {
          manager.transitionTo('charged')
        }
      }),
      charged: Ember.State.create({
        boot: function(manager, context) {
          manager.transitionTo('poweredUp')
        }
      })
    }),
    poweredUp: Ember.State.create({
      beginExtermination: function(manager, context) {
        manager.transitionTo('rampaging')
      },
      rampaging: Ember.State.create()
    })
  });

  robotManager.get('currentState.name'); // 'charging'
  robotManager.send('boot'); // throws error, no boot action
                            // in current hierarchy
  robotManager.get('currentState.name'); // remains 'charging'

  robotManager.send('beginExtermination'); // throws error, no beginExtermination
                                          // action in current hierarchy
  robotManager.get('currentState.name');   // remains 'charging'

  robotManager.send('chargeComplete');
  robotManager.get('currentState.name');   // 'charged'

  robotManager.send('boot');
  robotManager.get('currentState.name');   // 'poweredUp'

  robotManager.send('beginExtermination', allHumans);
  robotManager.get('currentState.name');   // 'rampaging'
  ```

  Transition actions can also be created using the `transitionTo` method of the `Ember.State` class. The
  following example StateManagers are equivalent:

  ```javascript
  var aManager = Ember.StateManager.create({
    stateOne: Ember.State.create({
      changeToStateTwo: Ember.State.transitionTo('stateTwo')
    }),
    stateTwo: Ember.State.create({})
  });

  var bManager = Ember.StateManager.create({
    stateOne: Ember.State.create({
      changeToStateTwo: function(manager, context) {
        manager.transitionTo('stateTwo', context)
      }
    }),
    stateTwo: Ember.State.create({})
  });
  ```

  @class StateManager
  @namespace Ember
  @extends Ember.State
**/
Ember.StateManager = Ember.State.extend({
  /**
    @private

    When creating a new statemanager, look for a default state to transition
    into. This state can either be named `start`, or can be specified using the
    `initialState` property.

    @method init
  */
  init: function() {
    this._super();

    set(this, 'stateMeta', Ember.Map.create());

    var initialState = get(this, 'initialState');

    if (!initialState && get(this, 'states.start')) {
      initialState = 'start';
    }

    if (initialState) {
      this.transitionTo(initialState);
      Ember.assert('Failed to transition to initial state "' + initialState + '"', !!get(this, 'currentState'));
    }
  },

  /**
    Return the stateMeta, a hash of possible states. If no items exist in the stateMeta hash
    this method sets the stateMeta to an empty JavaScript object and returns that instead.

    @method stateMetaFor
    @param state
  */
  stateMetaFor: function(state) {
    var meta = get(this, 'stateMeta'),
        stateMeta = meta.get(state);

    if (!stateMeta) {
      stateMeta = {};
      meta.set(state, stateMeta);
    }

    return stateMeta;
  },

  /**
    Sets a key value pair on the stateMeta hash.

    @method setStateMeta
    @param state
    @param key
    @param value
  */
  setStateMeta: function(state, key, value) {
    return set(this.stateMetaFor(state), key, value);
  },

  /**
    Returns the value of an item in the stateMeta hash at the given key.

    @method getStateMeta
    @param state
    @param key
  */
  getStateMeta: function(state, key) {
    return get(this.stateMetaFor(state), key);
  },

  /**
    The current state from among the manager's possible states. This property should
    not be set directly. Use `transitionTo` to move between states by name.

    @property currentState
    @type Ember.State
  */
  currentState: null,

  /**
   The path of the current state. Returns a string representation of the current
   state.

   @property currentPath
   @type String
  */
  currentPath: Ember.computed.alias('currentState.path'),

  /**
    The name of transitionEvent that this stateManager will dispatch

    @property transitionEvent
    @type String
    @default 'setup'
  */
  transitionEvent: 'setup',

  /**
    If set to true, `errorOnUnhandledEvents` will cause an exception to be
    raised if you attempt to send an event to a state manager that is not
    handled by the current state or any of its parent states.

    @property errorOnUnhandledEvents
    @type Boolean
    @default true
  */
  errorOnUnhandledEvent: true,

  /**
    An alias to sendEvent method

    @method send
    @param event
  */
  send: function(event) {
    var contexts = [].slice.call(arguments, 1);
    Ember.assert('Cannot send event "' + event + '" while currentState is ' + get(this, 'currentState'), get(this, 'currentState'));
    return sendEvent.call(this, event, contexts, false);
  },

  /**
    If errorOnUnhandledEvent is true this event with throw an Ember.Error
    indicating that the no state could respond to the event passed through the
    state machine.

    @method unhandledEvent
    @param manager
    @param event
  */
  unhandledEvent: function(manager, event) {
    if (get(this, 'errorOnUnhandledEvent')) {
      throw new Ember.Error(this.toString() + " could not respond to event " + event + " in state " + get(this, 'currentState.path') + ".");
    }
  },

  /**
    Finds a state by its state path.

    Example:

    ```javascript
    var manager = Ember.StateManager.create({
      root: Ember.State.create({
        dashboard: Ember.State.create()
      })
    });

    manager.getStateByPath(manager, "root.dashboard");
    // returns the dashboard state
  
    var aState = manager.getStateByPath(manager, "root.dashboard");

    var path = aState.get('path');
    // path is 'root.dashboard'

    var name = aState.get('name');
    // name is 'dashboard'
    ```

    @method getStateByPath
    @param {Ember.State} root the state to start searching from
    @param {String} path the state path to follow
    @return {Ember.State} the state at the end of the path
  */
  getStateByPath: function(root, path) {
    var parts = path.split('.'),
        state = root;

    for (var i=0, len=parts.length; i<len; i++) {
      state = get(get(state, 'states'), parts[i]);
      if (!state) { break; }
    }

    return state;
  },

  findStateByPath: function(state, path) {
    var possible;

    while (!possible && state) {
      possible = this.getStateByPath(state, path);
      state = get(state, 'parentState');
    }

    return possible;
  },

  /**
    A state stores its child states in its `states` hash.
    This code takes a path like `posts.show` and looks
    up `root.states.posts.states.show`.

    It returns a list of all of the states from the
    root, which is the list of states to call `enter`
    on.

    @method getStatesInPath
    @param root
    @param path
  */
  getStatesInPath: function(root, path) {
    if (!path || path === "") { return undefined; }
    var parts = path.split('.'),
        result = [],
        states,
        state;

    for (var i=0, len=parts.length; i<len; i++) {
      states = get(root, 'states');
      if (!states) { return undefined; }
      state = get(states, parts[i]);
      if (state) { root = state; result.push(state); }
      else { return undefined; }
    }

    return result;
  },

  /**
    Alias for transitionTo.
    This method applies a transitionTo to the arguments passed into this method. 

    @method goToState
  */
  goToState: function() {
    // not deprecating this yet so people don't constantly need to
    // make trivial changes for little reason.
    return this.transitionTo.apply(this, arguments);
  },

  /**
    Transition to another state within the state machine. If the path is empty returns
    immediately. This method attempts to get a hash of the enter, exit and resolve states
    from the existing state cache. Processes the raw state information based on the
    passed in context. Creates a new transition object and triggers a new setupContext.

    @method transitionTo
    @param path
    @param context
  */
  transitionTo: function(path, context) {
    // XXX When is transitionTo called with no path
    if (Ember.isEmpty(path)) { return; }

    // The ES6 signature of this function is `path, ...contexts`
    var contexts = context ? Array.prototype.slice.call(arguments, 1) : [],
        currentState = get(this, 'currentState') || this;

    // First, get the enter, exit and resolve states for the current state
    // and specified path. If possible, use an existing cache.
    var hash = this.contextFreeTransition(currentState, path);

    // Next, process the raw state information for the contexts passed in.
    var transition = new Transition(hash).normalize(this, contexts);

    this.enterState(transition);
    this.triggerSetupContext(transition);
  },

  /**
    Allows you to transition to any other state in the state manager without
    being constrained by the state hierarchy of the current state path.
    This method will traverse the state path upwards through its parents until
    it finds the specified state path. All the transitions are captured during the
    traversal. 

    Caches and returns hash of transitions, which contain the exitSates, enterStates and 
    resolvedState

    @method contextFreeTransition
    @param currentState
    @param path
  */
  contextFreeTransition: function(currentState, path) {
    var cache = currentState.getPathsCache(this, path);
    if (cache) { return cache; }

    var enterStates = this.getStatesInPath(currentState, path),
        exitStates = [],
        resolveState = currentState;

    // Walk up the states. For each state, check whether a state matching
    // the `path` is nested underneath. This will find the closest
    // parent state containing `path`.
    //
    // This allows the user to pass in a relative path. For example, for
    // the following state hierarchy:
    //
    //    | |root
    //    | |- posts
    //    | | |- show (* current)
    //    | |- comments
    //    | | |- show
    //
    // If the current state is `<root.posts.show>`, an attempt to
    // transition to `comments.show` will match `<root.comments.show>`.
    //
    // First, this code will look for root.posts.show.comments.show.
    // Next, it will look for root.posts.comments.show. Finally,
    // it will look for `root.comments.show`, and find the state.
    //
    // After this process, the following variables will exist:
    //
    // * resolveState: a common parent state between the current
    //   and target state. In the above example, `<root>` is the
    //   `resolveState`.
    // * enterStates: a list of all of the states represented
    //   by the path from the `resolveState`. For example, for
    //   the path `root.comments.show`, `enterStates` would have
    //   `[<root.comments>, <root.comments.show>]`
    // * exitStates: a list of all of the states from the
    //   `resolveState` to the `currentState`. In the above
    //   example, `exitStates` would have
    //   `[<root.posts>`, `<root.posts.show>]`.
    while (resolveState && !enterStates) {
      exitStates.unshift(resolveState);

      resolveState = get(resolveState, 'parentState');
      if (!resolveState) {
        enterStates = this.getStatesInPath(this, path);
        if (!enterStates) {
          Ember.assert('Could not find state for path: "'+path+'"');
          return;
        }
      }
      enterStates = this.getStatesInPath(resolveState, path);
    }

    // If the path contains some states that are parents of both the
    // current state and the target state, remove them.
    //
    // For example, in the following hierarchy:
    //
    // |- root
    // | |- post
    // | | |- index (* current)
    // | | |- show
    //
    // If the `path` is `root.post.show`, the three variables will
    // be:
    //
    // * resolveState: `<state manager>`
    // * enterStates: `[<root>, <root.post>, <root.post.show>]`
    // * exitStates: `[<root>, <root.post>, <root.post.index>]`
    //
    // The goal of this code is to remove the common states, so we
    // have:
    //
    // * resolveState: `<root.post>`
    // * enterStates: `[<root.post.show>]`
    // * exitStates: `[<root.post.index>]`
    //
    // This avoid unnecessary calls to the enter and exit transitions.
    while (enterStates.length > 0 && enterStates[0] === exitStates[0]) {
      resolveState = enterStates.shift();
      exitStates.shift();
    }

    // Cache the enterStates, exitStates, and resolveState for the
    // current state and the `path`.
    var transitions = {
      exitStates: exitStates,
      enterStates: enterStates,
      resolveState: resolveState
    };

    currentState.setPathsCache(this, path, transitions);

    return transitions;
  },

  /**
    A trigger to setup the state contexts. Each state is setup with
    an enterState.

    @method triggerSetupContext
    @param transitions
  */
  triggerSetupContext: function(transitions) {
    var contexts = transitions.contexts,
        offset = transitions.enterStates.length - contexts.length,
        enterStates = transitions.enterStates,
        transitionEvent = get(this, 'transitionEvent');

    Ember.assert("More contexts provided than states", offset >= 0);

    arrayForEach.call(enterStates, function(state, idx) {
      state.trigger(transitionEvent, this, contexts[idx-offset]);
    }, this);
  },

  /**
    Returns the state instance by name. If state is not found the parentState
    is returned instead.

    @method getState
    @param name
  */
  getState: function(name) {
    var state = get(this, name),
        parentState = get(this, 'parentState');

    if (state) {
      return state;
    } else if (parentState) {
      return parentState.getState(name);
    }
  },

  /**
    Causes a transition from the exitState of one state to the enterState of another
    state in the state machine. At the end of the transition the currentState is set
    to the finalState of the transition passed into this method.

    @method enterState
    @param transition
  */
  enterState: function(transition) {
    var log = this.enableLogging;

    var exitStates = transition.exitStates.slice(0).reverse();
    arrayForEach.call(exitStates, function(state) {
      state.trigger('exit', this);
    }, this);

    arrayForEach.call(transition.enterStates, function(state) {
      if (log) { Ember.Logger.log("STATEMANAGER: Entering " + get(state, 'path')); }
      state.trigger('enter', this);
    }, this);

    set(this, 'currentState', transition.finalState);
  }
});

})();



(function() {
/**
Ember States

@module ember
@submodule ember-states
@requires ember-runtime
*/

})();


})();
window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '170121459849102',                        // App ID from the app dashboard
    channelUrl : "/assets/channel.html", // Channel file for x-domain comms
    status     : true,                                 // Check Facebook Login status
    xfbml      : true                                  // Look for social plugins on the page
  });

  // Additional initialization code such as adding Event Listeners goes here
};

// Load the SDK asynchronously
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
(function(){var a=(function(){var a={};var b=function(b,c,d){var e=b.split(".");for(var f=0;f<e.length-1;f++){if(!d[e[f]])d[e[f]]={};d=d[e[f]];}if(typeof c==="function")if(c.isClass)d[e[f]]=c;else d[e[f]]=function(){return c.apply(a,arguments);};else d[e[f]]=c;};var c=function(c,d,e){b(c,d,a);if(e)b(c,d,window.filepicker);};var d=function(b,d,e){if(typeof b==="function"){e=d;d=b;b='';}if(b)b+=".";var f=d.call(a);for(var g in f)c(b+g,f[g],e);};var e=function(b){b.apply(a,arguments);};return{extend:d,internal:e};})();if(!window.filepicker)window.filepicker=a;else for(attr in a)window.filepicker[attr]=a[attr];})();filepicker.extend("ajax",function(){var a=this;var b=function(a,b){b.method='GET';f(a,b);};var c=function(b,c){c.method='POST';b+=(b.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();f(b,c);};var d=function(b,c){var e=[];for(var f in b){var g=b[f];if(c)f=c+'['+f+']';var h;switch(a.util.typeOf(g)){case 'object':h=d(g,f);break;case 'array':var i={};for(var j=0;j<g.length;j++)i[j]=g[j];h=d(i,f);break;default:h=f+'='+encodeURIComponent(g);break;}if(g!==null)e.push(h);}return e.join('&');};var e=function(){try{return new window.XMLHttpRequest();}catch(a){try{return new window.ActiveXObject("Msxml2.XMLHTTP");}catch(a){try{return new window.ActiveXObject("Microsoft.XMLHTTP");}catch(a){return null;}}}};var f=function(b,c){b=b||"";var f=c.method?c.method.toUpperCase():"POST";var h=c.success||function(){};var i=c.error||function(){};var j=c.async===undefined?true:c.async;var k=c.data||null;var l=c.processData===undefined?true:c.processData;var m=c.headers||{};var n=a.util.parseUrl(b);var o=window.location.protocol+'//'+window.location.host;var p=o!==n.origin;var q=false;if(k&&l)k=d(c.data);var r;if(c.xhr)r=c.xhr;else{r=e();if(!r){c.error("Ajax not allowed");return r;}}if(p&&window.XDomainRequest&&!("withCredentials" in r))return g(b,c);if(c.progress&&r.upload)r.upload.addEventListener("progress",function(a){if(a.lengthComputable)c.progress(Math.round((a.loaded*95)/a.total));},false);var s=function(){if(r.readyState==4&&!q){if(c.progress)c.progress(100);if(r.status>=200&&r.status<300){var b=r.responseText;if(c.json)try{b=a.json.decode(b);}catch(d){t.call(r,"Invalid json: "+b);return;}h(b,r.status,r);q=true;}else{t.call(r,r.responseText);q=true;}}};r.onreadystatechange=s;var t=function(a){if(q)return;if(c.progress)c.progress(100);q=true;if(this.status==400){i("bad_params",this.status,this);return;}else if(this.status==403){i("not_authorized",this.status,this);return;}else if(this.status==404){i("not_found",this.status,this);return;}if(p)if(this.readyState==4&&this.status===0){i("CORS_not_allowed",this.status,this);return;}else{i("CORS_error",this.status,this);return;}i(a,this.status,this);};r.onerror=t;if(k&&f=='GET'){b+=(b.indexOf('?')!=-1?'&':'?')+k;k=null;}r.open(f,b,j);if(c.json)r.setRequestHeader('Accept','application/json, text/javascript');else r.setRequestHeader('Accept','text/javascript, text/html, application/xml, text/xml, */*');var u=m['Content-Type']||m['content-type'];if(k&&l&&(f=="POST"||f=="PUT")&&u==undefined)r.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');if(m)for(var v in m)r.setRequestHeader(v,m[v]);r.send(k);return r;};var g=function(b,c){if(!window.XDomainRequest)return null;var e=c.method?c.method.toUpperCase():"POST";var f=c.success||function(){};var g=c.error||function(){};var h=c.data||{};if(window.location.protocol=="http:")b=b.replace("https:","http:");else if(window.location.protocol=="https:")b=b.replace("http:","https:");if(c.async)throw new a.FilepickerException("Asyncronous Cross-domain requests are not supported");if(e!="GET"&&e!="POST"){h._method=e;e="POST";}if(c.processData!==false)h=h?d(h):null;if(h&&e=='GET'){b+=(b.indexOf('?')>=0?'&':'?')+h;h=null;}b+=(b.indexOf('?')>=0?'&':'?')+'_xdr=true&_cacheBust='+a.util.getId();var i=new window.XDomainRequest();i.onload=function(){var b=i.responseText;if(c.progress)c.progress(100);if(c.json)try{b=a.json.decode(b);}catch(d){g("Invalid json: "+b,200,i);return;}f(b,200,i);};i.onerror=function(){if(c.progress)c.progress(100);g(i.responseText||"CORS_error",this.status||500,this);};i.onprogress=function(){};i.ontimeout=function(){};i.timeout=30000;i.open(e,b,true);i.send(h);return i;};return{get:b,post:c,request:f};});filepicker.extend("base64",function(){var a=this;var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c=function(a,c){c=c||c===undefined;var d="";var f,g,h,i,j,k,l;var m=0;if(c)a=e(a);while(m<a.length){f=a.charCodeAt(m);g=a.charCodeAt(m+1);h=a.charCodeAt(m+2);m+=3;i=f>>2;j=((f&3)<<4)|(g>>4);k=((g&15)<<2)|(h>>6);l=h&63;if(isNaN(g))k=l=64;else if(isNaN(h))l=64;d=d+b.charAt(i)+b.charAt(j)+b.charAt(k)+b.charAt(l);}return d;};var d=function(a,c){c=c||c===undefined;var d="";var e,g,h;var i,j,k,l;var m=0;a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(m<a.length){i=b.indexOf(a.charAt(m));j=b.indexOf(a.charAt(m+1));k=b.indexOf(a.charAt(m+2));l=b.indexOf(a.charAt(m+3));m+=4;e=(i<<2)|(j>>4);g=((j&15)<<4)|(k>>2);h=((k&3)<<6)|l;d=d+String.fromCharCode(e);if(k!=64)d=d+String.fromCharCode(g);if(l!=64)d=d+String.fromCharCode(h);}if(c)d=f(d);return d;};var e=function(a){a=a.replace(/\r\n/g,"\n");var b="";for(var c=0;c<a.length;c++){var d=a.charCodeAt(c);if(d<128)b+=String.fromCharCode(d);else if((d>127)&&(d<2048)){b+=String.fromCharCode((d>>6)|192);b+=String.fromCharCode((d&63)|128);}else{b+=String.fromCharCode((d>>12)|224);b+=String.fromCharCode(((d>>6)&63)|128);b+=String.fromCharCode((d&63)|128);}}return b;};var f=function(a){var b="";var c=0;var d=c1=c2=0;while(c<a.length){d=a.charCodeAt(c);if(d<128){b+=String.fromCharCode(d);c++;}else if((d>191)&&(d<224)){c2=a.charCodeAt(c+1);b+=String.fromCharCode(((d&31)<<6)|(c2&63));c+=2;}else{c2=a.charCodeAt(c+1);c3=a.charCodeAt(c+2);b+=String.fromCharCode(((d&15)<<12)|((c2&63)<<6)|(c3&63));c+=3;}}return b;};return{encode:c,decode:d};},true);filepicker.extend("browser",function(){var a=this;var b=function(){return !!(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/iPad/i));};var c=function(){return !!navigator.userAgent.match(/Android/i);};var d=function(){return !!navigator.userAgent.match(/MSIE 7\.0/i);};return{isIOS:b,isAndroid:c,isIE7:d};});filepicker.extend("comm",function(){var a=this;var b="filepicker_comm_iframe";var c=function(){if(window.frames[b]===undefined){f();var c;c=document.createElement("iframe");c.id=c.name=b;c.src=a.urls.COMM;c.style.display='none';document.body.appendChild(c);}};var d=function(b){if(b.origin!=a.urls.BASE)return;var c=a.json.parse(b.data);a.handlers.run(c);};var e=false;var f=function(){if(e)return;else e=true;if(window.addEventListener)window.addEventListener("message",d,false);else if(window.attachEvent)window.attachEvent("onmessage",d);else throw new a.FilepickerException("Unsupported browser");};var g=function(){if(window.removeEventListener)window.removeEventListener("message",d,false);else if(window.attachEvent)window.detachEvent("onmessage",d);else throw new a.FilepickerException("Unsupported browser");if(!e)return;else e=false;var c=document.getElementsByName(b);for(var f=0;f<c.length;f++)c[f].parentNode.removeChild(c[f]);try{delete window.frames[b];}catch(g){}};return{openChannel:c,closeChannel:g};});filepicker.extend("comm_fallback",function(){var a=this;var b="filepicker_comm_iframe";var c="host_comm_iframe";var d="";var e=200;var f=function(){g();};var g=function(){if(window.frames[c]===undefined){var b;b=document.createElement("iframe");b.id=b.name=c;d=b.src=a.urls.constructHostCommFallback();b.style.display='none';var e=function(){d=b.contentWindow.location.href;h();};if(b.attachEvent)b.attachEvent('onload',e);else b.onload=e;document.body.appendChild(b);}};var h=function(){if(window.frames[b]===undefined){var c;c=document.createElement("iframe");c.id=c.name=b;c.src=a.urls.FP_COMM_FALLBACK+"?host_url="+encodeURIComponent(d);c.style.display='none';document.body.appendChild(c);}m();};var i=false;var j=undefined;var k="";var l=function(){var d=window.frames[b];if(!d)return;var e=d.frames[c];if(!e)return;var f=e.location.hash;if(f&&f.charAt(0)=="#")f=f.substr(1);if(f===k)return;k=f;if(!k)return;var g;try{g=a.json.parse(f);}catch(h){}if(g)a.handlers.run(g);};var m=function(){if(i)return;else i=true;j=window.setInterval(l,e);};var n=function(){window.clearInterval(j);if(!i)return;else i=false;var a=document.getElementsByName(b);for(var d=0;d<a.length;d++)a[d].parentNode.removeChild(a[d]);try{delete window.frames[b];}catch(e){}a=document.getElementsByName(c);for(d=0;d<a.length;d++)a[d].parentNode.removeChild(a[d]);try{delete window.frames[c];}catch(e){}};var o=!('postMessage' in window);var p=function(a){if(a!==o){o=!!a;if(o)r();else s();}};var q;var r=function(){q=a.comm;a.comm={openChannel:f,closeChannel:n};};var s=function(){a.comm=q;q=undefined;};if(o)r();return{openChannel:f,closeChannel:n,isEnabled:o};});filepicker.extend("conversions",function(){var a=this;var b={width:'number',height:'number',fit:'string',format:'string',watermark:'string',watermark_size:'number',watermark_position:'string',align:'string',crop:'string or array',quality:'number',text:'string',text_font:'string',text_size:'number',text_color:'string',text_align:'string',text_padding:'number',policy:'string',signature:'string',storeLocation:'string',storePath:'string',storeAccess:'string',rotate:'string or number'};var c=function(c){var d;for(var e in c){d=false;for(var f in b)if(e==f){d=true;if(b[f].indexOf(a.util.typeOf(c[e]))===-1)throw new a.FilepickerException("Conversion parameter "+e+" is not the right type: "+c[e]+". Should be a "+b[f]);}if(!d)throw new a.FilepickerException("Conversion parameter "+e+" is not a valid parameter.");}};var d=function(b,d,e,f,g){c(d);if(d.crop&&a.util.isArray(d.crop))d.crop=d.crop.join(",");a.ajax.post(b+'/convert',{data:d,json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(141));else if(b=="bad_params")f(new a.errors.FPError(142));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(143));},progress:g});};return{convert:d};});filepicker.extend("cookies",function(){var a=this;var b=function(b){var c=function(c){if(c.type!=="ThirdPartyCookies")return;a.cookies.THIRD_PARTY_COOKIES=!!c.payload;if(b&&typeof b==="function")b(!!c.payload);};return c;};var c=function(c){var d=b(c);a.handlers.attach('cookies',d);a.comm.openChannel();};return{checkThirdParty:c};});filepicker.extend("dragdrop",function(){var a=this;var b=function(){return(!!window.FileReader||navigator.userAgent.indexOf("Safari")>=0)&&('draggable' in document.createElement('span'));};var c=function(c,d){var e="No DOM element found to create drop pane";if(!c)throw new a.FilepickerException(e);if(c.jquery){if(c.length===0)throw new a.FilepickerException(e);c=c[0];}if(!b()){a.util.console.error("Your browser doesn't support drag-drop functionality");return false;}d=d||{};var f=d.dragEnter||function(){};var g=d.dragLeave||function(){};var h=d.onStart||function(){};var i=d.onSuccess||function(){};var j=d.onError||function(){};var k=d.onProgress||function(){};var l=d.mimetypes;if(!l)if(d.mimetype)l=[d.mimetype];else l=["*/*"];if(a.util.typeOf(l)=='string')l=l.split(',');var m=d.extensions;if(!m)if(d.extension)m=[d.extensions];if(a.util.typeOf(m)=='string')m=m.split(',');var n={location:d.location,path:d.path,access:d.access,policy:d.policy,signature:d.signature};c.addEventListener("dragenter",function(a){f();a.stopPropagation();a.preventDefault();return false;},false);c.addEventListener("dragleave",function(a){g();a.stopPropagation();a.preventDefault();return false;},false);c.addEventListener("dragover",function(a){a.preventDefault();return false;},false);c.addEventListener("drop",function(b){b.stopPropagation();b.preventDefault();var c;var d;var e;if(b.dataTransfer.items){d=b.dataTransfer.items;for(c=0;c<d.length;c++){e=d[c]&&d[c].webkitGetAsEntry?d[c].webkitGetAsEntry():undefined;if(e&&!!e.isDirectory){j("WrongType","Uploading a folder is not allowed");return;}}}var f=b.dataTransfer.files;var g=f.length;if(u(f)){h(f);for(c=0;c<f.length;c++)a.store(f[c],n,q(c,g),r,s(c,g));}});var o={};var p=[];var q=function(a,b){return function(c){if(!d.multiple)i([c]);else{p.push(c);if(p.length==b){i(p);p=[];}else{o[a]=100;t(b);}}};};var r=function(a){j("UploadError",a.toString());};var s=function(a,b){return function(c){o[a]=c;t(b);};};var t=function(a){var b=0;for(var c in o)b+=o[c];var d=b/a;k(d);};var u=function(b){if(b.length>0){if(b.length>1&&!d.multiple){j("TooManyFiles","Only one file at a time");return false;}var c;var e;var f;for(var g=0;g<b.length;g++){c=false;e=b[g];f=e.name||e.fileName||'"Unknown file"';for(var h=0;h<l.length;h++){var i=a.mimetypes.getMimetype(e);c=c||a.mimetypes.matchesMimetype(i,l[h]);}if(!c){j("WrongType",f+" isn't the right type of file");return false;}if(m){c=false;for(h=0;h<m.length;h++)c=c||a.util.endsWith(f,m[h]);if(!c){j("WrongType",f+" isn't the right type of file");return false;}}if(e.size&&!!d.maxSize&&e.size>d.maxSize){j("WrongSize",f+" is too large ("+e.size+" Bytes)");return false;}}return true;}else j("NoFilesFound","No files uploaded");return false;};return true;};return{enabled:b,makeDropPane:c};});filepicker.extend("errors",function(){var a=this;var b=function(a){if(this===window)return new b(a);this.code=a;if(filepicker.debug){var c=filepicker.error_map[this.code];this.message=c.message;this.moreInfo=c.moreInfo;this.toString=function(){return "FPError "+this.code+": "+this.message+". For help, see "+this.moreInfo;};}else this.toString=function(){return "FPError "+this.code+". Include filepicker_debug.js for more info";};return this;};b.isClass=true;var c=function(b){if(filepicker.debug)a.util.console.error(b.toString());};return{FPError:b,handleError:c};},true);filepicker.extend("exporter",function(){var a=this;var b=function(b){var c=function(c,d,e){if(b[d]&&!a.util.isArray(b[d]))b[d]=[b[d]];else if(b[c])b[d]=[b[c]];else if(e)b[d]=e;};if(b.mimetype&&b.extension)throw a.FilepickerException("Error: Cannot pass in both mimetype and extension parameters to the export function");c('service','services');if(b.services)for(var d=0;d<b.services.length;d++){var e=(''+b.services[d]).replace(" ","");var f=a.services[e];b.services[d]=(f===undefined?e:f);}if(b.openTo)b.openTo=a.services[b.openTo]||b.openTo;a.util.setDefault(b,'container','modal');};var c=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(132));}else{var e={};e.url=d.payload.url;e.filename=d.payload.data.filename;e.mimetype=d.payload.data.type;e.size=d.payload.data.size;e.isWriteable=true;b(e);}a.modal.close();};return d;};var d=function(e,f,g,h){b(f);if(f.debug){setTimeout(function(){g({url:"https://www.filepicker.io/api/file/-nBq2onTSemLBxlcBWn1",filename:'test.png',mimetype:'image/png',size:58979});},1);return;}if(a.cookies.THIRD_PARTY_COOKIES===undefined){a.cookies.checkThirdParty(function(){d(e,f,g,h);});return;}var i=a.util.getId();var j=false;var k=function(a){j=true;g(a);};var l=function(a){j=true;h(a);};var m=function(){if(!j){j=true;h(a.errors.FPError(131));}};if(f.container=='modal'&&(f.mobile||a.window.shouldForce()))f.container='window';a.window.open(f.container,a.urls.constructExportUrl(e,f,i),m);a.handlers.attach(i,c(k,l));};return{createExporter:d};});filepicker.extend("files",function(){var a=this;var b=function(b,d,e,f,g){var h=d.base64encode===undefined;if(h)d.base64encode=true;d.base64encode=d.base64encode!==false;var i=function(b){if(h)b=a.base64.decode(b,!!d.asText);e(b);};c.call(this,b,d,i,f,g);};var c=function(b,c,d,e,f){if(c.cache!==true)c._cacheBust=a.util.getId();a.ajax.get(b,{data:c,headers:{'X-NO-STREAM':true},success:d,error:function(b,c,d){if(b=="CORS_not_allowed")e(new a.errors.FPError(113));else if(b=="CORS_error")e(new a.errors.FPError(114));else if(b=="not_found")e(new a.errors.FPError(115));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(118));},progress:f});};var d=function(b,c,d,e,f){if(!(window.File&&window.FileReader&&window.FileList&&window.Blob)){f(10);a.files.storeFile(b,{},function(b){f(50);a.files.readFromFPUrl(b.url,c,d,e,function(a){f(50+a/2);});},e,function(a){f(a/2);});return;}var g=!!c.base64encode;var h=!!c.asText;var i=new FileReader();i.onprogress=function(a){if(a.lengthComputable)f(Math.round((a.loaded/a.total)*100));};i.onload=function(b){f(100);if(g)d(a.base64.encode(b.target.result,h));else d(b.target.result);};i.onerror=function(b){switch(b.target.error.code){case b.target.error.NOT_FOUND_ERR:e(new a.errors.FPError(115));break;case b.target.error.NOT_READABLE_ERR:e(new a.errors.FPError(116));break;case b.target.error.ABORT_ERR:e(new a.errors.FPError(117));break;default:e(new a.errors.FPError(118));break;}};if(h||!i.readAsBinaryString)i.readAsText(b);else i.readAsBinaryString(b);};var e=function(b,c,d,e,f,g){var h=d.mimetype||'text/plain';a.ajax.post(a.urls.constructWriteUrl(b,d),{headers:{'Content-Type':h},data:c,processData:false,json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));},progress:g});};var f=function(b,c,d,e,f,g){var h=function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));};var i=function(b){e(a.util.standardizeFPFile(b));};k(c,a.urls.constructWriteUrl(b,d),i,h,g);};var g=function(b,c,d,e,f,g){var h=function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));};var i=function(b){e(a.util.standardizeFPFile(b));};d.mimetype=c.type;k(c,a.urls.constructWriteUrl(b,d),i,h,g);};var h=function(b,c,d,e,f,g){a.ajax.post(a.urls.constructWriteUrl(b,d),{data:{'url':c},json:true,success:function(b){e(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")f(new a.errors.FPError(121));else if(b=="bad_params")f(new a.errors.FPError(122));else if(b=="not_authorized")f(new a.errors.FPError(403));else f(new a.errors.FPError(123));},progress:g});};var i=function(b,c,d,e,f){if(b.files){if(b.files.length===0)e(new a.errors.FPError(115));else j(b.files[0],c,d,e,f);return;}a.util.setDefault(c,'storage','S3');if(!c.filename)c.filename=b.value.replace("C:\\fakepath\\","")||b.name;var g=b.name;b.name="fileUpload";a.iframeAjax.post(a.urls.constructStoreUrl(c),{data:b,processData:false,json:true,success:function(c){b.name=g;d(a.util.standardizeFPFile(c));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(123));}});};var j=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');var g=function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else{a.util.console.error(b);e(new a.errors.FPError(123));}};var h=function(b){d(a.util.standardizeFPFile(b));};if(!c.filename)c.filename=b.name||b.fileName;k(b,a.urls.constructStoreUrl(c),h,g,f);};var k=function(b,c,d,e,f){if(b.files)b=b.files[0];var g=!!window.FormData&&!!window.XMLHttpRequest;if(g){data=new FormData();data.append('fileUpload',b);a.ajax.post(c,{json:true,processData:false,data:data,success:d,error:e,progress:f});}else a.iframeAjax.post(c,{data:b,json:true,success:d,error:e});};var l=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');a.util.setDefault(c,'mimetype','text/plain');a.ajax.post(a.urls.constructStoreUrl(c),{headers:{'Content-Type':c.mimetype},data:b,processData:false,json:true,success:function(b){d(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(121));else if(b=="bad_params")e(new a.errors.FPError(122));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(123));},progress:f});};var m=function(b,c,d,e,f){a.util.setDefault(c,'storage','S3');a.ajax.post(a.urls.constructStoreUrl(c),{data:{'url':b},json:true,success:function(b){d(a.util.standardizeFPFile(b));},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(151));else if(b=="bad_params")e(new a.errors.FPError(152));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(153));},progress:f});};var n=function(b,c,d,e){var f=['uploaded','modified','created'];if(c.cache!==true)c._cacheBust=a.util.getId();a.ajax.get(b+"/metadata",{json:true,data:c,success:function(a){for(var b=0;b<f.length;b++)if(a[f[b]])a[f[b]]=new Date(a[f[b]]);d(a);},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(161));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(162));}});};var o=function(b,c,d,e){c.key=a.apikey;a.ajax.post(b+"/remove",{data:c,success:function(a){d();},error:function(b,c,d){if(b=="not_found")e(new a.errors.FPError(171));else if(b=="bad_params")e(new a.errors.FPError(400));else if(b=="not_authorized")e(new a.errors.FPError(403));else e(new a.errors.FPError(172));}});};return{readFromUrl:c,readFromFile:d,readFromFPUrl:b,writeDataToFPUrl:e,writeFileToFPUrl:g,writeFileInputToFPUrl:f,writeUrlToFPUrl:h,storeFileInput:i,storeFile:j,storeUrl:m,storeData:l,stat:n,remove:o};});filepicker.extend("handlers",function(){var a=this;var b={};var c=function(a,c){if(b.hasOwnProperty(a))b[a].push(c);else b[a]=[c];return c;};var d=function(a,c){var d=b[a];if(!d)return;if(c){for(var e=0;e<d.length;e++)if(d[e]===c){d.splice(e,1);break;}if(d.length===0)delete b[a];}else delete b[a];};var e=function(a){var c=a.id;if(b.hasOwnProperty(c)){var d=b[c];for(var e=0;e<d.length;e++)d[e](a);return true;}return false;};return{attach:c,detach:d,run:e};});filepicker.extend("iframeAjax",function(){var a=this;var b="ajax_iframe";var c=[];var d=false;var e=function(a,b){b.method='GET';h(a,b);};var f=function(b,c){c.method='POST';b+=(b.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();h(b,c);};var g=function(){if(c.length>0){var a=c.shift();h(a.url,a.options);}};var h=function(e,f){if(d){c.push({url:e,options:f});return;}e+=(e.indexOf('?')>=0?'&':'?')+'_cacheBust='+a.util.getId();e+="&Content-Type=text%2Fhtml";a.comm.openChannel();var g;try{g=document.createElement('<iframe name="'+b+'">');}catch(h){g=document.createElement('iframe');}g.id=g.name=b;g.style.display='none';var k=function(){d=false;};if(g.attachEvent){g.attachEvent("onload",k);g.attachEvent("onerror",k);}else g.onerror=g.onload=k;g.id=b;g.name=b;g.style.display='none';g.onerror=g.onload=function(){d=false;};document.body.appendChild(g);a.handlers.attach('upload',i(f));var l=document.createElement("form");l.method=f.method||'GET';l.action=e;l.target=b;var m=f.data;if(a.util.isFileInputElement(m)||a.util.isFile(m))l.encoding=l.enctype="multipart/form-data";document.body.appendChild(l);if(a.util.isFile(m)){var n=j(m);if(!n)throw a.FilepickerException("Couldn't find corresponding file input.");m={'fileUpload':n};}else if(a.util.isFileInputElement(m)){var o=m;m={};m.fileUpload=o;}else if(m&&a.util.isElement(m)&&m.tagName=="INPUT"){o=m;m={};m[o.name]=o;}else if(f.processData!==false)m={'data':m};m.format='iframe';var p={};for(var q in m){var r=m[q];if(a.util.isElement(r)&&r.tagName=="INPUT"){p[q]={par:r.parentNode,sib:r.nextSibling,name:r.name,input:r,focused:r==document.activeElement};r.name=q;l.appendChild(r);}else{var s=document.createElement("input");s.name=q;s.value=r;l.appendChild(s);}}d=true;window.setTimeout(function(){l.submit();for(var a in p){var b=p[a];b.par.insertBefore(b.input,b.sib);b.input.name=b.name;if(b.focused)b.input.focus();}l.parentNode.removeChild(l);},1);};var i=function(b){var c=b.success||function(){};var e=b.error||function(){};var f=function(b){if(b.type!=="Upload")return;d=false;var f=b.payload;if(f.error)e(f.error);else c(f);a.handlers.detach("upload");g();};return f;};var j=function(a){var b=document.getElementsByTagName("input");for(var c=0;c<b.length;c++){var d=b[0];if(d.type!="file"||!d.files||!d.files.length)continue;for(var e=0;e<d.files.length;e++)if(d.files[e]===a)return d;}return null;};return{get:e,post:f,request:h};});filepicker.extend("json",function(){var a=this;var b={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};var c=function(a){return b[a]||'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);};var d=function(a){a=a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');return(/^[\],:{}\s]*$/).test(a);};var e=function(b){if(window.JSON&&window.JSON.stringify)return window.JSON.stringify(b);if(b&&b.toJSON)b=b.toJSON();var d=[];switch(a.util.typeOf(b)){case 'string':return '"'+b.replace(/[\x00-\x1f\\"]/g,c)+'"';case 'array':for(var f=0;f<b.length;f++)d.push(e(b[f]));return '['+d+']';case 'object':case 'hash':var g;var h;for(h in b){g=e(b[h]);if(g)d.push(e(h)+':'+g);g=null;}return '{'+d+'}';case 'number':case 'boolean':return ''+b;case 'null':return 'null';default:return 'null';}return null;};var f=function(b,c){if(!b||a.util.typeOf(b)!='string')return null;if(window.JSON&&window.JSON.parse)return window.JSON.parse(b);else{if(c)if(!d(b))throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');return eval('('+b+')');}};return{validate:d,encode:e,stringify:e,decode:f,parse:f};});filepicker.extend(function(){var a=this;a.API_VERSION="v1";var b=function(b){a.apikey=b;};var c=function(a){this.text=a;this.toString=function(){return "FilepickerException: "+this.text;};return this;};c.isClass=true;var d=function(){if(!a.apikey)throw new a.FilepickerException("API Key not found");};var e=function(b,c,e){d();if(typeof b==="function"){e=c;c=b;b={};}b=b||{};c=c||function(){};e=e||a.errors.handleError;a.picker.createPicker(b,c,e,false);};var f=function(b,c,e){d();if(typeof b==="function"){e=c;c=b;b={};}b=b||{};c=c||function(){};e=e||a.errors.handleError;a.picker.createPicker(b,c,e,true);};var g=function(b,c,e,f){d();if(!b||!c||typeof b==="function"||typeof b==="function")throw new a.FilepickerException("Not all required parameters given, missing picker or store options");f=f||a.errors.handleError;var g=!!b.multiple;var h=!!b?a.util.clone(b):{};h.storeLocation=c.location||'S3';h.storePath=c.path;h.storeAccess=c.access||'private';if(g&&h.storePath)if(h.storePath.charAt(h.storePath.length-1)!="/")throw new a.FilepickerException("pickAndStore with multiple files requires a path that ends in '/'");var i=e;if(!g)i=function(a){e([a]);};a.picker.createPicker(h,i,f,g);};var h=function(b,c,e){d();if(typeof b==="function"){e=c;c=b;b={};}b=b||{};c=c||function(){};e=e||a.errors.handleError;a.picker.createPicker(b,c,e,false,true);};var i=function(b,c,e,f,g){d();if(!b)throw new a.FilepickerException("No input given - nothing to read!");if(typeof c==="function"){g=f;f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};if(typeof b=="string")if(a.util.isFPUrl(b))a.files.readFromFPUrl(b,c,e,f,g);else a.files.readFromUrl(b,c,e,f,g);else if(a.util.isFileInputElement(b))if(!b.files)j(b,c,e,f,g);else if(b.files.length===0)f(new a.errors.FPError(115));else a.files.readFromFile(b.files[0],c,e,f,g);else if(a.util.isFile(b))a.files.readFromFile(b,c,e,f,g);else if(b.url)a.files.readFromFPUrl(b.url,c,e,f,g);else throw new a.FilepickerException("Cannot read given input: "+b+". Not a url, file input, DOM File, or FPFile object.");};var j=function(b,c,d,e,f){f(10);a.store(b,function(b){f(50);a.read(b,c,d,e,function(a){f(50+a/2);});},e);};var k=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to write to!");if(c===undefined||c===null)throw new a.FilepickerException("No input given - nothing to write!");if(typeof e==="function"){h=g;g=f;f=e;e={};}e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};var i;if(a.util.isFPUrl(b))i=b;else if(b.url)i=b.url;else throw new a.FilepickerException("Invalid file to write to: "+b+". Not a filepicker url or FPFile object.");if(typeof c=="string")a.files.writeDataToFPUrl(i,c,e,f,g,h);else if(a.util.isFileInputElement(c))if(!c.files)a.files.writeFileInputToFPUrl(i,c,e,f,g,h);else if(c.files.length===0)g(new a.errors.FPError(115));else a.files.writeFileToFPUrl(i,c.files[0],e,f,g,h);else if(a.util.isFile(c))a.files.writeFileToFPUrl(i,c,e,f,g,h);else if(c.url)a.files.writeUrlToFPUrl(i,c.url,e,f,g,h);else throw new a.FilepickerException("Cannot read from given input: "+c+". Not a string, file input, DOM File, or FPFile object.");};var l=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to write to!");if(c===undefined||c===null)throw new a.FilepickerException("No input given - nothing to write!");if(typeof e==="function"){h=g;g=f;f=e;e={};}e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};var i;if(a.util.isFPUrl(b))i=b;else if(b.url)i=b.url;else throw new a.FilepickerException("Invalid file to write to: "+b+". Not a filepicker url or FPFile object.");a.files.writeUrlToFPUrl(i,c,e,f,g,h);};var m=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=!!c?a.util.clone(c):{};e=e||function(){};f=f||a.errors.handleError;var g;if(typeof b=="string"&&a.util.isUrl(b))g=b;else if(b.url){g=b.url;if(!c.mimetype&&!c.extension)c.mimetype=b.mimetype;if(!c.suggestedFilename)c.suggestedFilename=b.filename;}else throw new a.FilepickerException("Invalid file to export: "+b+". Not a valid url or FPFile object. You may want to use filepicker.store() to get an FPFile to export");a.exporter.createExporter(g,c,e,f);};var n=function(b,c,e,f,g){d();if(typeof c==="function"){g=f;f=e;e=c;c={};}c=!!c?a.util.clone(c):{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};if(typeof b=="string")a.files.storeData(b,c,e,f,g);else if(a.util.isFileInputElement(b))if(!b.files)a.files.storeFileInput(b,c,e,f,g);else if(b.files.length===0)f(new a.errors.FPError(115));else a.files.storeFile(b.files[0],c,e,f,g);else if(a.util.isFile(b))a.files.storeFile(b,c,e,f,g);else if(b.url){if(!c.filename)c.filename=b.filename;a.files.storeUrl(b.url,c,e,f,g);}else throw new a.FilepickerException("Cannot store given input: "+b+". Not a string, file input, DOM File, or FPFile object.");};var o=function(b,c,e,f,g){d();if(typeof c==="function"){g=f;f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;g=g||function(){};a.files.storeUrl(b,c,e,f,g);};var p=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;var g;if(a.util.isFPUrl(b))g=b;else if(b.url)g=b.url;else throw new a.FilepickerException("Invalid file to get metadata for: "+b+". Not a filepicker url or FPFile object.");a.files.stat(g,c,e,f);};var q=function(b,c,e,f){d();if(typeof c==="function"){f=e;e=c;c={};}c=c||{};e=e||function(){};f=f||a.errors.handleError;var g;if(a.util.isFPUrl(b))g=b;else if(b.url)g=b.url;else throw new a.FilepickerException("Invalid file to remove: "+b+". Not a filepicker url or FPFile object.");a.files.remove(g,c,e,f);};var r=function(b,c,e,f,g,h){d();if(!b)throw new a.FilepickerException("No fpfile given - nothing to convert!");if(typeof e==="function"){h=g;g=f;f=e;e={};}options=!!c?a.util.clone(c):{};e=e||{};f=f||function(){};g=g||a.errors.handleError;h=h||function(){};if(e.location)options.storeLocation=e.location;if(e.path)options.storePath=e.path;options.storeAccess=e.access||'private';var i;if(a.util.isFPUrl(b))i=b;else if(b.url){i=b.url;if(!a.mimetypes.matchesMimetype(b.mimetype,'image/*')){g(new a.errors.FPError(142));return;}}else throw new a.FilepickerException("Invalid file to convert: "+b+". Not a filepicker url or FPFile object.");a.conversions.convert(i,options,f,g,h);};var s=function(b){return a.widgets.constructWidget(b);};var t=function(b,c){return a.dragdrop.makeDropPane(b,c);};return{setKey:b,pick:e,pickFolder:h,pickMultiple:f,pickAndStore:g,read:i,write:k,writeUrl:l,'export':m,exportFile:m,store:n,storeUrl:o,stat:p,metadata:p,remove:q,convert:r,constructWidget:s,makeDropPane:t,FilepickerException:c};},true);filepicker.extend('mimetypes',function(){var a=this;var b={'.stl':'application/sla','.hbs':'text/html','.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.jpe':'image/jpeg','.imp':'application/x-impressionist'};var c=['application/octet-stream','application/download','application/force-download','octet/stream','application/unknown','application/x-download','application/x-msdownload','application/x-secure-download'];var d=function(a){if(a.type){var d=a.type;d=d.toLowerCase();var e=false;for(var f=0;f<c.length;f++)e=e||d==c[f];if(!e)return a.type;}var g=a.name||a.fileName;var h=g.match(/\.\w*$/);if(h)return b[h[0].toLowerCase()]||'';else if(a.type)return a.type;else return '';};var e=function(b,d){if(!b)return d=="*/*";b=a.util.trim(b).toLowerCase();d=a.util.trim(d).toLowerCase();for(var e=0;e<c.length;e++)if(b==c[e])return true;test_parts=b.split("/");against_parts=d.split("/");if(against_parts[0]=="*")return true;if(against_parts[0]!=test_parts[0])return false;if(against_parts[1]=="*")return true;return against_parts[1]==test_parts[1];};return{getMimetype:d,matchesMimetype:e};});filepicker.extend("modal",function(){var a=this;var b="filepicker_shade";var c="filepicker_dialog_container";var d=function(b,c){var d=e(c);var h=f();var i=g(c);var j=document.createElement("iframe");j.name=a.window.WINDOW_NAME;j.id=a.window.WINDOW_NAME;var k=a.window.getSize();var l=Math.min(k[1]-40,500);j.style.width='100%';j.style.height=l-32+'px';j.style.border="none";j.style.position="relative";j.setAttribute('border',0);j.setAttribute('frameborder',0);j.setAttribute('frameBorder',0);j.setAttribute('marginwidth',0);j.setAttribute('marginheight',0);j.src=b;document.body.appendChild(d);h.appendChild(i);h.appendChild(j);document.body.appendChild(h);return j;};var e=function(a){var c=document.createElement("div");c.id=b;c.style.position='fixed';c.style.top=0;c.style.bottom=0;c.style.right=0;c.style.left=0;c.style.backgroundColor='#000000';c.style.opacity='0.5';c.style.filter='alpha(opacity=50)';c.style.zIndex=10000;c.onclick=h(a);return c;};var f=function(){var b=document.createElement("div");b.id=c;b.style.position='fixed';b.style.padding="10px";b.style.background='#ffffff url("https://www.filepicker.io/static/img/spinner.gif") no-repeat 50% 50%';b.style.top='10px';b.style.bottom='auto';b.style.right='auto';var d=a.window.getSize();var e=Math.min(d[1]-40,500);var f=Math.max(Math.min(d[0]-40,800),620);var g=(d[0]-f-40)/2;b.style.left=g+"px";b.style.height=e+'px';b.style.width=f+'px';b.style.overflow='hidden';b.style.webkitOverflowScrolling='touch';b.style.border='1px solid #999';b.style.webkitBorderRadius='3px';b.style.borderRadius='3px';b.style.margin='0';b.style.webkitBoxShadow='0 3px 7px rgba(0, 0, 0, 0.3)';b.style.boxShadow='0 3px 7px rgba(0, 0, 0, 0.3)';b.style.zIndex=10001;b.style.boxSizing="content-box";b.style.webkitBoxSizing="content-box";b.style.mozBoxSizing="content-box";return b;};var g=function(a){var b=document.createElement("a");b.appendChild(document.createTextNode('\u00D7'));b.onclick=h(a);b.style.cssFloat="right";b.style.styleFloat="right";b.style.cursor="default";b.style.padding='0 5px 0 0px';b.style.fontSize='1.5em';b.style.color='#555555';b.style.textDecoration='none';return b;};var h=function(d,e){e=!!e;return function(){if(a.uploading&&!e)if(!window.confirm("You are currently uploading. If you choose 'OK', the window will close and your upload will not finish. Do you want to stop uploading and close the window?"))return;a.uploading=false;var f=document.getElementById(b);if(f)document.body.removeChild(f);var g=document.getElementById(c);if(g)document.body.removeChild(g);try{delete window.frames[a.window.WINDOW_NAME];}catch(h){}if(d)d();};};var i=h(function(){});return{generate:d,close:i};});filepicker.extend("picker",function(){var a=this;var b=function(b){var c=function(c,d,e){if(b[d]){if(!a.util.isArray(b[d]))b[d]=[b[d]];}else if(b[c])b[d]=[b[c]];else if(e)b[d]=e;};c('service','services');c('mimetype','mimetypes');c('extension','extensions');if(b.services)for(var d=0;d<b.services.length;d++){var e=(''+b.services[d]).replace(" ","");if(a.services[e]!==undefined)e=a.services[e];b.services[d]=e;}if(b.mimetypes&&b.extensions)throw a.FilepickerException("Error: Cannot pass in both mimetype and extension parameters to the pick function");if(!b.mimetypes&&!b.extensions)b.mimetypes=['*/*'];if(b.openTo)b.openTo=a.services[b.openTo]||b.openTo;a.util.setDefault(b,'container','modal');};var c=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;a.uploading=false;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(102));}else{var e={};e.url=d.payload.url;e.filename=d.payload.data.filename;e.mimetype=d.payload.data.type;e.size=d.payload.data.size;if(d.payload.data.key)e.key=d.payload.data.key;e.isWriteable=true;b(e);}a.modal.close();};return d;};var d=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;a.uploading=false;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(102));}else{d.payload.data.url=d.payload.url;b(d.payload.data);}a.modal.close();};return d;};var e=function(b){b=b||function(){};var c=function(c){if(c.type!=="uploading")return;a.uploading=!!c.payload;b(a.uploading);};return c;};var f=function(b,c){var d=function(d){if(d.type!=="filepickerUrl")return;a.uploading=false;if(d.error){a.util.console.error(d.error);c(a.errors.FPError(102));}else{var e=[];if(!a.util.isArray(d.payload))d.payload=[d.payload];for(var f=0;f<d.payload.length;f++){var g={};var h=d.payload[f];g.url=h.url;g.filename=h.data.filename;g.mimetype=h.data.type;g.size=h.data.size;if(h.data.key)g.key=h.data.key;g.isWriteable=true;e.push(g);}b(e);}a.modal.close();};return d;};var g=function(h,i,j,k,l){b(h);if(h.debug){setTimeout(function(){i({url:"https://www.filepicker.io/api/file/-nBq2onTSemLBxlcBWn1",filename:'test.png',mimetype:'image/png',size:58979});},1);return;}if(a.cookies.THIRD_PARTY_COOKIES===undefined){a.cookies.checkThirdParty(function(){g(h,i,j,!!k);});return;}var m=a.util.getId();var n=false;var o=function(a){n=true;i(a);};var p=function(a){n=true;j(a);};var q=function(){if(!n){n=true;j(a.errors.FPError(101));}};if(h.container=='modal'&&(h.mobile||a.window.shouldForce()))h.container='window';var r;var s;if(k){r=a.urls.constructPickUrl(h,m,true);s=f(o,p);}else if(l){r=a.urls.constructPickFolderUrl(h,m);s=d(o,p);}else{r=a.urls.constructPickUrl(h,m,false);s=c(o,p);}a.window.open(h.container,r,q);a.handlers.attach(m,s);var t=m+"-upload";a.handlers.attach(t,e(function(){a.handlers.detach(t);}));};return{createPicker:g};});filepicker.extend('services',function(){return{COMPUTER:1,DROPBOX:2,FACEBOOK:3,GITHUB:4,GMAIL:5,IMAGE_SEARCH:6,URL:7,WEBCAM:8,GOOGLE_DRIVE:9,SEND_EMAIL:10,INSTAGRAM:11,FLICKR:12,VIDEO:13,EVERNOTE:14,PICASA:15,WEBDAV:16,FTP:17,ALFRESCO:18,BOX:19,SKYDRIVE:20};},true);filepicker.extend('util',function(){var a=this;var b=function(a){return a.replace(/^\s+|\s+$/g,"");};var c=/^(http|https)\:.*\/\//i;var d=function(a){return !!a.match(c);};var e=function(a){if(!a||a.charAt(0)=='/')a=window.location.protocol+"//"+window.location.host+a;var b=document.createElement('a');b.href=a;var c=b.hostname.indexOf(":")==-1?b.hostname:b.host;var d={source:a,protocol:b.protocol.replace(':',''),host:c,port:b.port,query:b.search,params:(function(){var a={},c=b.search.replace(/^\?/,'').split('&'),d=c.length,e=0,f;for(;e<d;e++){if(!c[e])continue;f=c[e].split('=');a[f[0]]=f[1];}return a;})(),file:(b.pathname.match(/\/([^\/?#]+)$/i)||[,''])[1],hash:b.hash.replace('#',''),path:b.pathname.replace(/^([^\/])/,'/$1'),relative:(b.href.match(/tps?:\/\/[^\/]+(.+)/)||[,''])[1],segments:b.pathname.replace(/^\//,'').split('/')};d.origin=d.protocol+"://"+d.host+(d.port?":"+d.port:'');return d;};var f=function(a,b){return a.indexOf(b,a.length-b.length)!==-1;};return{trim:b,parseUrl:e,isUrl:d,endsWith:f};});filepicker.extend("urls",function(){var a=this;var b="https://www.filepicker.io";if(window.filepicker.hostname)b=window.filepicker.hostname;var c=b+"/dialog/open/";var d=b+"/dialog/save/";var e=b+"/dialog/folder/";var f=b+"/api/store/";var g=function(b,d,e){return c+"?key="+a.apikey+"&id="+d+"&referrer="+window.location.hostname+"&iframe="+(b.container!='window')+"&version="+a.API_VERSION+(b.services?"&s="+b.services.join(","):"")+(e?"&multi="+!!e:"")+(b.mimetypes!==undefined?"&m="+b.mimetypes.join(","):"")+(b.extensions!==undefined?"&ext="+b.extensions.join(","):"")+(b.openTo!==undefined?"&loc="+b.openTo:"")+(b.maxSize?"&maxSize="+b.maxSize:"")+(b.maxFiles?"&maxFiles="+b.maxFiles:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"")+(b.mobile!==undefined?"&mobile="+b.mobile:"")+(b.storeLocation?"&storeLocation="+b.storeLocation:"")+(b.storePath?"&storePath="+b.storePath:"")+(b.storeAccess?"&storeAccess="+b.storeAccess:"");};var h=function(b,c){return e+"?key="+a.apikey+"&id="+c+"&referrer="+window.location.hostname+"&iframe="+(b.container!='window')+"&version="+a.API_VERSION+(b.services?"&s="+b.services.join(","):"")+(b.openTo!==undefined?"&loc="+b.openTo:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"")+(b.mobile!==undefined?"&mobile="+b.mobile:"");};var i=function(b,c,e){if(b.indexOf("&")>=0||b.indexOf("?")>=0)b=encodeURIComponent(b);return d+"?url="+b+"&key="+a.apikey+"&id="+e+"&referrer="+window.location.hostname+"&iframe="+(c.container!='window')+"&version="+a.API_VERSION+(c.services?"&s="+c.services.join(","):"")+(c.openTo!==undefined?"&loc="+c.openTo:"")+(c.mimetype!==undefined?"&m="+c.mimetype:"")+(c.extension!==undefined?"&ext="+c.extension:"")+(c.mobile!==undefined?"&mobile="+c.mobile:"")+(c.suggestedFilename!==undefined?"&defaultSaveasName="+c.suggestedFilename:"")+(c.signature?"&signature="+c.signature:"")+(c.policy?"&policy="+c.policy:"");};var j=function(b){return f+b.storage+"?key="+a.apikey+(b.base64decode?"&base64decode=true":"")+(b.mimetype?"&mimetype="+b.mimetype:"")+(b.filename?"&filename="+b.filename:"")+(b.path?"&path="+b.path:"")+(b.access?"&access="+b.access:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"");};var k=function(a,b){return a+"?nonce=fp"+(!!b.base64decode?"&base64decode=true":"")+(b.mimetype?"&mimetype="+b.mimetype:"")+(b.signature?"&signature="+b.signature:"")+(b.policy?"&policy="+b.policy:"");};var l=function(){var b=a.util.parseUrl(window.location.href);return b.origin+"/404";};return{BASE:b,COMM:b+"/dialog/comm_iframe/",FP_COMM_FALLBACK:b+"/dialog/comm_hash_iframe/",STORE:f,PICK:c,EXPORT:d,constructPickUrl:g,constructPickFolderUrl:h,constructExportUrl:i,constructWriteUrl:k,constructStoreUrl:j,constructHostCommFallback:l};});filepicker.extend("util",function(){var a=this;var b=function(a){return a&&Object.prototype.toString.call(a)==='[object Array]';};var c=function(a){return a&&Object.prototype.toString.call(a)==='[object File]';};var d=function(a){if(typeof HTMLElement==="object")return a instanceof HTMLElement;else return a&&typeof a==="object"&&a.nodeType===1&&typeof a.nodeName==="string";};var e=function(a){return d(a)&&a.tagName=="INPUT"&&a.type=="file";};var f=function(a){if(a===null)return 'null';else if(b(a))return 'array';else if(c(a))return 'file';return typeof a;};var g=function(){var a=new Date();return a.getTime().toString();};var h=function(a,b,c){if(a[b]===undefined)a[b]=c;};var i=function(a){if(window.jQuery)window.jQuery(function(){a();});else{var b="load";if(window.addEventListener)window.addEventListener(b,a,false);else if(window.attachEvent)window.attachEvent("on"+b,a);else if(window.onload){var c=window.onload;window.onload=function(){c();a();};}else window.onload=a;}};var j=function(a){return typeof a=="string"&&a.match("www.filepicker.io/api/file/");};var k=function(a){return function(){if(window.console&&typeof window.console[a]=="function")try{window.console[a].apply(window.console,arguments);}catch(b){alert(Array.prototype.join.call(arguments,","));}};};var l={};l.log=k("log");l.error=k("error");var m=function(a){var b={};for(key in a)b[key]=a[key];return b;};var n=function(a){var b={};b.url=a.url;b.filename=a.filename||a.name;b.mimetype=a.mimetype||a.type;b.size=a.size;b.key=a.key||a.s3_key;b.isWriteable=!!(a.isWriteable||a.writeable);return b;};return{isArray:b,isFile:c,isElement:d,isFileInputElement:e,getId:g,setDefault:h,typeOf:f,addOnLoad:i,isFPUrl:j,console:l,clone:m,standardizeFPFile:n};});filepicker.extend("widgets",function(){var a=this;var b=function(a,b,c,d){var e=d.getAttribute(c);if(e)b[a]=e;};var c=function(a,b){var c;if(document.createEvent){c=document.createEvent('Event');c.initEvent("change",true,false);c.fpfile=b?b[0]:undefined;c.fpfiles=b;a.dispatchEvent(c);}else if(document.createEventObject){c=document.createEventObject('Event');c.eventPhase=2;c.currentTarget=c.srcElement=c.target=a;c.fpfile=b?b[0]:undefined;c.fpfiles=b;a.fireEvent('onchange',c);}else if(a.onchange)a.onchange(b);};var d=function(d){var e=document.createElement("button");e.setAttribute('type','button');e.innerHTML=d.getAttribute('data-fp-button-text')||d.getAttribute('data-fp-text')||"Pick File";e.className=d.getAttribute('data-fp-button-class')||d.getAttribute('data-fp-class')||d.className;d.style.display="none";var f={};b("container",f,"data-fp-option-container",d);b("maxSize",f,"data-fp-option-maxsize",d);b("mimetype",f,"data-fp-mimetype",d);b("mimetypes",f,"data-fp-mimetypes",d);b("extension",f,"data-fp-extension",d);b("extensions",f,"data-fp-extensions",d);b("container",f,"data-fp-container",d);b("maxSize",f,"data-fp-maxSize",d);b("openTo",f,"data-fp-openTo",d);b("debug",f,"data-fp-debug",d);b("signature",f,"data-fp-signature",d);b("policy",f,"data-fp-policy",d);b("storeLocation",f,"data-fp-store-location",d);b("storePath",f,"data-fp-store-path",d);b("storeAccess",f,"data-fp-store-access",d);var g=d.getAttribute("data-fp-services");if(!g)g=d.getAttribute("data-fp-option-services");if(g){g=g.split(",");for(var h=0;h<g.length;h++)g[h]=a.services[g[h].replace(" ","")];f.services=g;}var i=d.getAttribute("data-fp-service");if(i)f.service=a.services[i.replace(" ","")];if(f.mimetypes)f.mimetypes=f.mimetypes.split(",");if(f.extensions)f.extensions=f.extensions.split(",");var j=d.getAttribute("data-fp-apikey");if(j)a.setKey(j);var k=(d.getAttribute("data-fp-multiple")||d.getAttribute("data-fp-option-multiple")||"false")=="true";if(k)e.onclick=function(){e.blur();a.pickMultiple(f,function(a){var b=[];for(var e=0;e<a.length;e++)b.push(a[e].url);d.value=b.join();c(d,a);});return false;};else e.onclick=function(){e.blur();a.pick(f,function(a){d.value=a.url;c(d,[a]);});return false;};d.parentNode.insertBefore(e,d.nextSibling);};var e=function(d){var e=document.createElement("div");e.className=d.getAttribute('data-fp-class')||d.className;e.style.padding="1px";d.style.display="none";d.parentNode.insertBefore(e,d.nextSibling);var i=document.createElement("button");i.setAttribute('type','button');i.innerHTML=d.getAttribute('data-fp-button-text')||"Pick File";i.className=d.getAttribute('data-fp-button-class')||'';e.appendChild(i);var j=document.createElement("div");g(j);j.innerHTML=d.getAttribute('data-fp-drag-text')||"Or drop files here";j.className=d.getAttribute('data-fp-drag-class')||'';e.appendChild(j);var k={};b("container",k,"data-fp-option-container",d);b("maxSize",k,"data-fp-option-maxsize",d);b("mimetype",k,"data-fp-mimetype",d);b("mimetypes",k,"data-fp-mimetypes",d);b("extension",k,"data-fp-extension",d);b("extensions",k,"data-fp-extensions",d);b("container",k,"data-fp-container",d);b("maxSize",k,"data-fp-maxSize",d);b("openTo",k,"data-fp-openTo",d);b("debug",k,"data-fp-debug",d);b("signature",k,"data-fp-signature",d);b("policy",k,"data-fp-policy",d);b("storeLocation",k,"data-fp-store-location",d);b("storePath",k,"data-fp-store-path",d);b("storeAccess",k,"data-fp-store-access",d);var l=d.getAttribute("data-fp-services");if(!l)l=d.getAttribute("data-fp-option-services");if(l){l=l.split(",");for(var m=0;m<l.length;m++)l[m]=a.services[l[m].replace(" ","")];k.services=l;}var n=d.getAttribute("data-fp-service");if(n)k.service=a.services[n.replace(" ","")];if(k.mimetypes)k.mimetypes=k.mimetypes.split(",");if(k.extensions)k.extensions=k.extensions.split(",");var o=d.getAttribute("data-fp-apikey");if(o)a.setKey(o);var p=(d.getAttribute("data-fp-multiple")||d.getAttribute("data-fp-option-multiple")||"false")=="true";if(a.dragdrop.enabled())h(j,p,k,d);else j.innerHTML="&nbsp;";if(p)j.onclick=i.onclick=function(){i.blur();a.pickMultiple(k,function(a){var b=[];var e=[];for(var g=0;g<a.length;g++){b.push(a[g].url);e.push(a[g].filename);}d.value=b.join();f(d,j,e.join(', '));c(d,a);});return false;};else j.onclick=i.onclick=function(){i.blur();a.pick(k,function(a){d.value=a.url;f(d,j,a.filename);c(d,[a]);});return false;};};var f=function(b,d,e){d.innerHTML=e;d.style.padding="2px 4px";d.style.cursor="default";d.style.width='';var f=document.createElement("span");f.innerHTML="X";f.style.borderRadius="8px";f.style.fontSize="14px";f.style.cssFloat="right";f.style.padding="0 3px";f.style.color="#600";f.style.cursor="pointer";var h=function(e){if(!e)e=window.event;e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();g(d);if(!a.dragdrop.enabled)d.innerHTML='&nbsp;';else d.innerHTML=b.getAttribute('data-fp-drag-text')||"Or drop files here";b.value='';c(b);return false;};if(f.addEventListener)f.addEventListener("click",h,false);else if(f.attachEvent)f.attachEvent("onclick",h);d.appendChild(f);};var g=function(a){a.style.border="1px dashed #AAA";a.style.display="inline-block";a.style.margin="0 0 0 4px";a.style.borderRadius="3px";a.style.backgroundColor="#F3F3F3";a.style.color="#333";a.style.fontSize="14px";a.style.lineHeight="22px";a.style.padding="2px 4px";a.style.verticalAlign="middle";a.style.cursor="pointer";a.style.overflow="hidden";};var h=function(b,d,e,g){var h=b.innerHTML;var j;a.dragdrop.makeDropPane(b,{multiple:d,maxSize:e.maxSize,mimetypes:e.mimetypes,mimetype:e.mimetype,extensions:e.extensions,extension:e.extension,location:e.storeLocation,path:e.storePath,access:e.storeAccess,policy:e.policy,signature:e.signature,dragEnter:function(){b.innerHTML="Drop to upload";b.style.backgroundColor="#E0E0E0";b.style.border="1px solid #000";},dragLeave:function(){b.innerHTML=h;b.style.backgroundColor="#F3F3F3";b.style.border="1px dashed #AAA";},onError:function(a,c){if(a=="TooManyFiles")b.innerHTML=c;else if(a=="WrongType")b.innerHTML=c;else if(a=="NoFilesFound")b.innerHTML=c;else if(a=="UploadError")b.innerHTML="Oops! Had trouble uploading.";},onStart:function(a){j=i(b);},onProgress:function(a){if(j)j.style.width=a+"%";},onSuccess:function(a){var d=[];var e=[];for(var h=0;h<a.length;h++){d.push(a[h].url);e.push(a[h].filename);}g.value=d.join();f(g,b,e.join(', '));c(g,a);}});};var i=function(a){var b=document.createElement("div");var c=a.offsetHeight-2;b.style.height=c+"px";b.style.backgroundColor="#0E90D2";b.style.width="2%";b.style.borderRadius="3px";a.style.width=a.offsetWidth+"px";a.style.padding="0";a.style.border="1px solid #AAA";a.style.backgroundColor="#F3F3F3";a.style.boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.1)";a.innerHTML="";a.appendChild(b);return b;};var j=function(c){c.onclick=function(){var d=c.getAttribute("data-fp-url");if(!d)return true;var e={};b("container",e,"data-fp-option-container",c);b("suggestedFilename",e,"data-fp-option-defaultSaveasName",c);b("container",e,"data-fp-container",c);b("suggestedFilename",e,"data-fp-suggestedFilename",c);b("mimetype",e,"data-fp-mimetype",c);b("extension",e,"data-fp-extension",c);var f=c.getAttribute("data-fp-services");if(!f)f=c.getAttribute("data-fp-option-services");if(f){f=f.split(",");for(var g=0;g<f.length;g++)f[g]=a.services[f[g].replace(" ","")];e.services=f;}var h=c.getAttribute("data-fp-service");if(h)e.service=a.services[h.replace(" ","")];apikey=c.getAttribute("data-fp-apikey");if(apikey)a.setKey(apikey);a.exportFile(d,e);return false;};};var k=function(){if(document.querySelectorAll){var a;var b=document.querySelectorAll('input[type="filepicker"]');for(a=0;a<b.length;a++)d(b[a]);var c=document.querySelectorAll('input[type="filepicker-dragdrop"]');for(a=0;a<c.length;a++)e(c[a]);var f=[];var g=document.querySelectorAll('button[data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);g=document.querySelectorAll('a[data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);g=document.querySelectorAll('input[type="button"][data-fp-url]');for(a=0;a<g.length;a++)f.push(g[a]);for(a=0;a<f.length;a++)j(f[a]);}};var l=function(a){if(a.jquery)a=a[0];var b=a.getAttribute('type');if(b=='filepicker')d(a);else if(b=='filepicker-dragdrop')e(a);else j(a);};return{constructPickWidget:d,constructDragWidget:e,constructExportWidget:j,buildWidgets:k,constructWidget:l};});filepicker.extend('window',function(){var a=this;var b={OPEN:'/dialog/open/',SAVEAS:'/dialog/save/'};var c="filepicker_dialog";var d="left=100,top=100,height=600,width=800,menubar=no,toolbar=no,location=no,personalbar=no,status=no,resizable=yes,scrollbars=yes,dependent=yes,dialog=yes";var e=1000;var f=function(){if(document.body&&document.body.offsetWidth){winW=document.body.offsetWidth;winH=document.body.offsetHeight;}if(document.compatMode=='CSS1Compat'&&document.documentElement&&document.documentElement.offsetWidth){winW=document.documentElement.offsetWidth;winH=document.documentElement.offsetHeight;}if(window.innerWidth&&window.innerHeight){winW=window.innerWidth;winH=window.innerHeight;}return [winW,winH];};var g=function(){var b=f()[0]<768;var c=a.cookies.THIRD_PARTY_COOKIES===false;return a.browser.isIOS()||a.browser.isAndroid()||b||c;};var h=function(b,f,h){h=h||function(){};if(!b)b='modal';if(b=='modal'&&g())b='window';if(b=='window'){var i=c+a.util.getId();var j=window.open(f,i,d);var k=window.setInterval(function(){if(!j||j.closed){window.clearInterval(k);h();}},e);}else if(b=='modal')a.modal.generate(f,h);else{var l=document.getElementById(b);if(!l)throw new a.FilepickerException("Container '"+b+"' not found. This should either be set to 'window','modal', or the ID of an iframe that is currently in the document.");l.src=f;}};return{open:h,WINDOW_NAME:c,getSize:f,shouldForce:g};});(function(){filepicker.internal(function(){var a=this;a.util.addOnLoad(a.cookies.checkThirdParty);a.util.addOnLoad(a.widgets.buildWidgets);});delete filepicker.internal;delete filepicker.extend;var a=filepicker._queue||[];var b;var c=a.length;if(c)for(var d=0;d<c;d++){b=a[d];filepicker[b[0]].apply(filepicker,b[1]);}if(filepicker._queue)delete filepicker._queue;})();
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2013, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

// Accommodate running jQuery or Zepto in noConflict() mode by
// using an anonymous function to redefine the $ shorthand name.
// See http://docs.jquery.com/Using_jQuery_with_Other_Libraries
// and http://zeptojs.com/
var libFuncName = null;

if (typeof jQuery === "undefined" &&
    typeof Zepto === "undefined" &&
    typeof $ === "function") {
  libFuncName = $;
} else if (typeof jQuery === "function") {
  libFuncName = jQuery;
} else if (typeof Zepto === "function") {
  libFuncName = Zepto;
} else {
  throw new TypeError();
}

(function ($, window, document, undefined) {
  'use strict';

  /*
    matchMedia() polyfill - Test a CSS media 
    type/query in JS. Authors & copyright (c) 2012: 
    Scott Jehl, Paul Irish, Nicholas Zakas. 
    Dual MIT/BSD license

    https://github.com/paulirish/matchMedia.js
  */

  window.matchMedia = window.matchMedia || (function( doc, undefined ) {

    "use strict";

    var bool,
        docElem = doc.documentElement,
        refNode = docElem.firstElementChild || docElem.firstChild,
        // fakeBody required for <FF4 when executed in <head>
        fakeBody = doc.createElement( "body" ),
        div = doc.createElement( "div" );

    div.id = "mq-test-1";
    div.style.cssText = "position:absolute;top:-100em";
    fakeBody.style.background = "none";
    fakeBody.appendChild(div);

    return function(q){

      div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

      docElem.insertBefore( fakeBody, refNode );
      bool = div.offsetWidth === 42;
      docElem.removeChild( fakeBody );

      return {
        matches: bool,
        media: q
      };

    };

  }( document ));

  // add dusty browser stuff
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisp */) {
      "use strict";
   
      if (this == null) {
        throw new TypeError();
      }

      var t = Object(this),
          len = t.length >>> 0;
      if (typeof fun !== "function") {
          return;
      }

      var res = [],
          thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i]; // in case fun mutates this
          if (fun && fun.call(thisp, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    }
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }
   
      var aArgs = Array.prototype.slice.call(arguments, 1), 
          fToBind = this, 
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
               ? this
               : oThis,
             aArgs.concat(Array.prototype.slice.call(arguments)));
          };
   
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
   
      return fBound;
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
          return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }

  // fake stop() for zepto.
  $.fn.stop = $.fn.stop || function() {
    return this;
  };

  window.Foundation = {
    name : 'Foundation',

    version : '4.3.1',

    cache : {},

    init : function (scope, libraries, method, options, response, /* internal */ nc) {
      var library_arr,
          args = [scope, method, options, response],
          responses = [],
          nc = nc || false;

      // disable library error catching,
      // used for development only
      if (nc) this.nc = nc;

      // check RTL
      this.rtl = /rtl/i.test($('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (/off/i.test(libraries)) return this.off();

        library_arr = libraries.split(' ');

        if (library_arr.length > 0) {
          for (var i = library_arr.length - 1; i >= 0; i--) {
            responses.push(this.init_lib(library_arr[i], args));
          }
        }
      } else {
        if (/reflow/i.test(libraries)) args[1] = 'reflow';

        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, args));
        }
      }

      // if first argument is callback, add to args
      if (typeof libraries === 'function') {
        args.unshift(libraries);
      }

      return this.response_obj(responses, args);
    },

    response_obj : function (response_arr, args) {
      for (var i = 0, len = args.length; i < len; i++) {
        if (typeof args[i] === 'function') {
          return args[i]({
            errors: response_arr.filter(function (s) {
              if (typeof s === 'string') return s;
            })
          });
        }
      }

      return response_arr;
    },

    init_lib : function (lib, args) {
      return this.trap(function () {
        if (this.libs.hasOwnProperty(lib)) {
          this.patch(this.libs[lib]);
          return this.libs[lib].init.apply(this.libs[lib], args);
        } else {
          return function () {};
        }
      }.bind(this), lib);
    },

    trap : function (fun, lib) {
      if (!this.nc) {
        try {
          return fun();
        } catch (e) {
          return this.error({name: lib, message: 'could not be initialized', more: e.name + ' ' + e.message});
        }
      }

      return fun();
    },

    patch : function (lib) {
      this.fix_outer(lib);
      lib.scope = this.scope;
      lib.rtl = this.rtl;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' ');

      for (var i = methods_arr.length - 1; i >= 0; i--) {
        if (this.lib_methods.hasOwnProperty(methods_arr[i])) {
          this.libs[scope.name][methods_arr[i]] = this.lib_methods[methods_arr[i]];
        }
      }
    },

    random_str : function (length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },

    libs : {},

    // methods that can be inherited in libraries
    lib_methods : {
      set_data : function (node, data) {
        // this.name references the name of the library calling this method
        var id = [this.name,+new Date(),Foundation.random_str(5)].join('-');

        Foundation.cache[id] = data;
        node.attr('data-' + this.name + '-id', id);
        return data;
      },

      get_data : function (node) {
        return Foundation.cache[node.attr('data-' + this.name + '-id')];
      },

      remove_data : function (node) {
        if (node) {
          delete Foundation.cache[node.attr('data-' + this.name + '-id')];
          node.attr('data-' + this.name + '-id', '');
        } else {
          $('[data-' + this.name + '-id]').each(function () {
            delete Foundation.cache[$(this).attr('data-' + this.name + '-id')];
            $(this).attr('data-' + this.name + '-id', '');
          });
        }
      },

      throttle : function(fun, delay) {
        var timer = null;
        return function () {
          var context = this, args = arguments;
          clearTimeout(timer);
          timer = setTimeout(function () {
            fun.apply(context, args);
          }, delay);
        };
      },

      // parses data-options attribute on nodes and turns
      // them into an object
      data_options : function (el) {
        var opts = {}, ii, p,
            opts_arr = (el.attr('data-options') || ':').split(';'),
            opts_len = opts_arr.length;

        function isNumber (o) {
          return ! isNaN (o-0) && o !== null && o !== "" && o !== false && o !== true;
        }

        function trim(str) {
          if (typeof str === 'string') return $.trim(str);
          return str;
        }

        // parse options
        for (ii = opts_len - 1; ii >= 0; ii--) {
          p = opts_arr[ii].split(':');

          if (/true/i.test(p[1])) p[1] = true;
          if (/false/i.test(p[1])) p[1] = false;
          if (isNumber(p[1])) p[1] = parseInt(p[1], 10);

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      delay : function (fun, delay) {
        return setTimeout(fun, delay);
      },

      // animated scrolling
      scrollTo : function (el, to, duration) {
        if (duration < 0) return;
        var difference = to - $(window).scrollTop();
        var perTick = difference / duration * 10;

        this.scrollToTimerCache = setTimeout(function() {
          if (!isNaN(parseInt(perTick, 10))) {
            window.scrollTo(0, $(window).scrollTop() + perTick);
            this.scrollTo(el, to, duration - 10);
          }
        }.bind(this), 10);
      },

      // not supported in core Zepto
      scrollLeft : function (el) {
        if (!el.length) return;
        return ('scrollLeft' in el[0]) ? el[0].scrollLeft : el[0].pageXOffset;
      },

      // test for empty object or array
      empty : function (obj) {
        if (obj.length && obj.length > 0)    return false;
        if (obj.length && obj.length === 0)  return true;

        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))    return false;
        }

        return true;
      }
    },

    fix_outer : function (lib) {
      lib.outerHeight = function (el, bool) {
        if (typeof Zepto === 'function') {
          return el.height();
        }

        if (typeof bool !== 'undefined') {
          return el.outerHeight(bool);
        }

        return el.outerHeight();
      };

      lib.outerWidth = function (el, bool) {
        if (typeof Zepto === 'function') {
          return el.width();
        }

        if (typeof bool !== 'undefined') {
          return el.outerWidth(bool);
        }

        return el.outerWidth();
      };
    },

    error : function (error) {
      return error.name + ' ' + error.message + '; ' + error.more;
    },

    // remove all foundation events.
    off: function () {
      $(this.scope).off('.fndtn');
      $(window).off('.fndtn');
      return true;
    },

    zj : $
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(libFuncName, this, this.document));
;(function ($, window, document, undefined) {
  'use strict';

  var noop = function() {};

  var Orbit = function(el, settings) {
    // Don't reinitialize plugin
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }

    var self = this,
        container,
        slides_container = el,
        number_container,
        bullets_container,
        timer_container,
        idx = 0,
        animate,
        timer,
        locked = false,
        adjust_height_after = false;

    slides_container.children().first().addClass(settings.active_slide_class);

    self.update_slide_number = function(index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index)+1);
        number_container.find('span:last').text(slides_container.children().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };

    self.build_markup = function() {
      slides_container.wrap('<div class="'+settings.container_class+'"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);
      
      if (settings.navigation_arrows) {
        container.append($('<a>').addClass(settings.prev_class).append('<span>'));
        container.append($('<a>').addClass(settings.next_class).append('<span>'));
      }

      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }

      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> of <span></span>');
        container.append(number_container);
      }

      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        slides_container.children().each(function(idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx);
          bullets_container.append(bullet);
        });
      }

      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }

      self.update_slide_number(0);
    };

    self._goto = function(next_idx, start_timer) {
      // if (locked) {return false;}
      if (next_idx === idx) {return false;}
      if (typeof timer === 'object') {timer.restart();}
      var slides = slides_container.children('li');
      console.log(slides);
      var dir = 'next';
      locked = true;
      if (next_idx < idx) {dir = 'prev';}
      if (next_idx >= slides.length) {next_idx = 0;}
      else if (next_idx < 0) {next_idx = slides.length - 1;}
      
      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));

      current.css('zIndex', 2);
      next.css('zIndex', 4).addClass('active');

      slides_container.trigger('orbit:before-slide-change');
      settings.before_slide_change();
      
      var callback = function() {
        var unlock = function() {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {timer = self.create_timer(); timer.start();}
          self.update_slide_number(idx);
          slides_container.trigger('orbit:after-slide-change',[{slide_number: idx, total_slides: slides.length}]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.height() != next.height()) {
          slides_container.animate({'height': next.height()}, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };

      if (slides.length === 1) {callback(); return false;}

      var start_animation = function() {
        if (dir === 'next') {animate.next(current, next, callback);}
        if (dir === 'prev') {animate.prev(current, next, callback);}        
      };

      if (next.height() > slides_container.height()) {
        slides_container.animate({'height': next.height()}, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };
    
    self.next = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };
    
    self.prev = function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };

    self.link_custom = function(e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if ((typeof link === 'string') && (link = $.trim(link)) != "") {
        var slide = container.find('[data-orbit-slide='+link+']');
        if (slide.index() != -1) {self._goto(slide.index());}
      }
    };

    self.link_bullet = function(e) {
      var index = $(this).attr('data-orbit-slide');
      if ((typeof index === 'string') && (index = $.trim(index)) != "") {
        self._goto(index);
      }
    }

    self.timer_callback = function() {
      self._goto(idx + 1, true);
    }
    
    self.compute_dimensions = function() {
      var current = $(slides_container.children().get(idx));
      var h = current.height();
      if (!settings.variable_height) {
        slides_container.children().each(function(){
          if ($(this).height() > h) { h = $(this).height(); }
        });
      }
      slides_container.height(h);
    };

    self.create_timer = function() {
      var t = new Timer(
        container.find('.'+settings.timer_container_class), 
        settings, 
        self.timer_callback
      );
      return t;
    };

    self.stop_timer = function() {
      if (typeof timer === 'object') timer.stop();
    };

    self.toggle_timer = function() {
      var t = container.find('.'+settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {timer = self.create_timer();}
        timer.start();     
      }
      else {
        if (typeof timer === 'object') {timer.stop();}
      }
    };

    self.init = function() {
      self.build_markup();
      if (settings.timer) {timer = self.create_timer(); timer.start();}
      animate = new FadeAnimation(slides_container);
      if (settings.animation === 'slide') 
        animate = new SlideAnimation(slides_container);        
      container.on('click', '.'+settings.next_class, self.next);
      container.on('click', '.'+settings.prev_class, self.prev);
      container.on('click', '[data-orbit-slide]', self.link_bullet);
      container.on('click', self.toggle_timer);
      container.on('touchstart.fndtn.orbit', function(e) {
        if (!e.touches) {e = e.originalEvent;}
        var data = {
          start_page_x: e.touches[0].pageX,
          start_page_y: e.touches[0].pageY,
          start_time: (new Date()).getTime(),
          delta_x: 0,
          is_scrolling: undefined
        };
        container.data('swipe-transition', data);
        e.stopPropagation();
      })
      .on('touchmove.fndtn.orbit', function(e) {
        if (!e.touches) { e = e.originalEvent; }
        // Ignore pinch/zoom events
        if(e.touches.length > 1 || e.scale && e.scale !== 1) return;

        var data = container.data('swipe-transition');
        if (typeof data === 'undefined') {data = {};}

        data.delta_x = e.touches[0].pageX - data.start_page_x;

        if ( typeof data.is_scrolling === 'undefined') {
          data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
        }

        if (!data.is_scrolling && !data.active) {
          e.preventDefault();
          var direction = (data.delta_x < 0) ? (idx+1) : (idx-1);
          data.active = true;
          self._goto(direction);
        }
      })
      .on('touchend.fndtn.orbit', function(e) {
        container.data('swipe-transition', {});
        e.stopPropagation();
      })
      .on('mouseenter.fndtn.orbit', function(e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      })
      .on('mouseleave.fndtn.orbit', function(e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });
      
      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('resize', self.compute_dimensions);
      $(window).on('load', self.compute_dimensions);
      slides_container.trigger('orbit:ready');
    };

    self.init();
  };

  var Timer = function(el, settings, callback) {
    var self = this,
        duration = settings.timer_speed,
        progress = el.find('.'+settings.timer_progress_class),
        start, 
        timeout,
        left = -1;

    this.update_progress = function(w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w+'%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };

    this.restart = function() {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };

    this.start = function() {
      if (!el.hasClass(settings.timer_paused_class)) {return true;}
      left = (left === -1) ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({'width': '100%'}, left, 'linear');
      timeout = setTimeout(function() {
        self.restart();
        callback();
      }, left);
      el.trigger('orbit:timer-started')
    };

    this.stop = function() {
      if (el.hasClass(settings.timer_paused_class)) {return true;}
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - ((left / duration) * 100);
      self.update_progress(w);
      el.trigger('orbit:timer-stopped');
    };
  };
  
  var SlideAnimation = function(container) {
    var duration = 400;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';

    this.next = function(current, next, callback) {
      next.animate({margin: '0%'}, duration, 'linear', function() {
        current.css(margin, '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      prev.css(margin, '-100%');
      prev.animate({margin:'0%'}, duration, 'linear', function() {
        current.css(margin, '100%');
        callback();
      });
    };
  };

  var FadeAnimation = function(container) {
    var duration = 250;

    this.next = function(current, next, callback) {
      next.css({'marginLeft':'0%', 'opacity':'0.01'});
      next.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('marginLeft', '100%');
        callback();
      });
    };

    this.prev = function(current, prev, callback) {
      prev.css({'marginLeft':'0%', 'opacity':'0.01'});
      prev.animate({'opacity':'1'}, duration, 'linear', function() {
        current.css('marginLeft', '100%');
        callback();
      });
    };
  };


  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name: 'orbit',

    version: '4.3.1',

    settings: {
      animation: 'slide',
      timer_speed: 10000,
      pause_on_hover: true,
      resume_on_mouseout: false,
      animation_speed: 500,
      stack_on_small: false,
      navigation_arrows: true,
      slide_number: true,
      container_class: 'orbit-container',
      stack_on_small_class: 'orbit-stack-on-small',
      next_class: 'orbit-next',
      prev_class: 'orbit-prev',
      timer_container_class: 'orbit-timer',
      timer_paused_class: 'paused',
      timer_progress_class: 'orbit-progress',
      slides_container_class: 'orbit-slides-container',
      bullets_container_class: 'orbit-bullets',
      bullets_active_class: 'active',
      slide_number_class: 'orbit-slide-number',
      caption_class: 'orbit-caption',
      active_slide_class: 'active',
      orbit_transition_class: 'orbit-transitioning',
      bullets: true,
      timer: true,
      variable_height: false,
      before_slide_change: noop,
      after_slide_change: noop
    },

    init: function (scope, method, options) {
      var self = this;
      Foundation.inherit(self, 'data_options');

      if (typeof method === 'object') {
        $.extend(true, self.settings, method);
      }

      if ($(scope).is('[data-orbit]')) {
        var $el = $(scope);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      }

      $('[data-orbit]', scope).each(function(idx, el) {
        var $el = $(el);
        var opts = self.data_options($el);
        new Orbit($el, $.extend({},self.settings, opts));
      });
    }
  };

    
}(Foundation.zj, this, this.document));
// //helpers

// function isInt(p) {
//  return p%1 === 0
// };

// //n = number of columns
// function gridify() {
//  $('.filler').remove(); //remove all filler tiles
//  var n = $('.container').width()/320; //or whatever the tile container column width is
//  var theElements = $('.tile'); //all tiles
//  var allElements = theElements.filter(":not(.filters):not(.logo):not(.footer)"); //filter out the filters, the logo, if there is one, and the footer
//  allElements.each(function() {
//    $(this).removeClass('fractional-inner'); //set back to the beginning case each time
//    if ($(this).attr('style') === ' ') {
//      $(this).addClass('tileHidden'); //add a nullifying class to all hidden elements
//    } else {
//      $(this).removeClass('tileHidden'); //remove the nullifying class from elements that have come back into view
//    };
//  });
//  var elements = allElements.filter(":visible"); //all visible tiles
//  var tileNumber = elements.length; //the number of tiles in the grid
//  var totalHeight = function() {
//    var h = 0;
//    for (var x = 0; x < elements.length; x++) {
//      var elHeight = parseFloat($(elements[x]).attr('data-height'));
//      var elWidth = parseFloat($(elements[x]).attr('data-width'));
//      var elArea = elHeight * elWidth;
//        h+= elArea;
//    };
//    return h;
//  }
//  var remainder = n-totalHeight()%n;
//  console.log('Number of tiles in grid: ' + tileNumber);
//  console.log('Number of columns: ' + n);
//  console.log('Total sum of heights: ' + totalHeight());
//  console.log('remainder is ' + remainder);
//  var inserter = null;
//  // for random insertion
//  // for (var y=0; y<remainder; y++) {
//  //  inserter = elements[Math.floor(Math.random()*elements.length)]; //get an element at a random position in the elements array
//  //  $(inserter).after('<div class="tile filler image-tile mix general_info all tile-1-wide" data-height="1" data-width="1"><img src="img/random-2.jpg"></div>'); //insert a random image on half gaps
//  // };
//  // for insertion at the end of the grid only
//  var lastElement = $(elements[(elements.length)-1]);
//  console.log('lastElement is ' + lastElement.attr('class'));
  
//  var randomImageArray = [];
//  //random image maker
//  // var randomImageMaker = function() {
//  //  if (remainder%1 !==0) //if the remainder is a fraction
//  //    {
//  //      //first insert a half tile
//  //      randomImageArray.push('<div style="display:inline-block; opacity:1" class="tile filler image-tile mix general_info all tile-1-wide tile-half-tall" data-height="0.5" data-width="1"><img src="img/random-2.jpg"></div>');
//  //      remainder -= 0.5;
//  //      //now recurse
//  //      randomImageMaker();
//  //    }
//  //  else {randomImageArray.push('<div style="display:inline-block; opacity:1" class="tile filler image-tile mix general_info all tile-' + remainder + '-wide" data-height="1" data-width="' + remainder + '"><img src="img/random-2.jpg"></div>');}
//  // };
//  // randomImageMaker();
//  var currentElement = null;
//  var currentRow = 1;
//  var currentElementHeight = null;
//  var sumHeight = 0;
//  for (var i=0; i < tileNumber; i++) {
//    currentElement = $(elements[i]); //get the current tile under inspection and wrap as jQuery object
//    console.log('Current Element is ' + currentElement.attr('class'));
//    if (sumHeight < n) {
//      sumHeight += parseFloat(currentElement.attr('data-height'))*parseFloat(currentElement.attr('data-width')); //get height of tile from data-attribute, in row units
//      console.log('sum of heights in this row is now ' + sumHeight);
//    }
//    else if (sumHeight%n === 0) { //if the total cell heights fill the row with no excess
//      sumHeight = parseFloat(currentElement.attr('data-height')); //if the sum of heights is greater than the column number, reset sumHeight to start iterating over a new row, seeding with the first tile
//      currentRow += 1;
//      console.log('Moving on to row ' + currentRow);
//    }
//    else {

//    }
//    if (isInt(sumHeight)) {
//      console.log('current tile fills the column, moving on.'); //if the sum of heights is an integer then do nothing
      
//    }
//    else {
//      console.log('We have a partially-heighted element!');
//      if (sumHeight < (n-1)) {
//        console.log('Tile is not in the last column, applying appropriate styles...');
//        currentElement.addClass('fractional-inner'); //if we're not in the last column in the row, move any subsequent tiles around
//      }
//      else {
//        console.log('Tile is in the last column, removing appropriate styles...');
//        currentElement.removeClass('fractional-inner'); //if we are in the last column in the row, remove all classes that invoke movement in subsequent tiles
//      }
//    }
//  }
// }
;
/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/browser-prefix.js
var Handlebars = {};
window.Handlebars = Handlebars;
(function(Handlebars, undefined) {
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
})(Handlebars);
;
/**
 * Isotope v1.5.25
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */

(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[j],r=h("transitionDuration"));var s=b.event,t=b.event.handle?"handle":"dispatch",u;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",u&&clearTimeout(u),u=setTimeout(function(){s[t].apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var v=["width","height"],w=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};var d=v.slice(0);for(var e in this.options.containerStyle)d.push(e);for(var f=0,g=d.length;f<g;f++)e=d[f],this.originalStyle[e]=c[e]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var h={"original-order":function(a,b){return b.elemCount++,b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,h),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var i=this;setTimeout(function(){i.element.addClass(i.options.containerClass)},0),this.options.resizable&&w.bind("smartresize.isotope",function(){i.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};return c=c.filter(function(a,b){return b.nodeType===1}),this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0),c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c),a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);return f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order")),(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left),c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(l)return;var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a,n);l=!0};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0],s=p&&p.$el,t;while(!s||!s.length){t=this.styleQueue[o++];if(!t)return;s=t.$el}var u=parseFloat(getComputedStyle(s[0])[r]);u>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){this.$allAtoms=this.$allAtoms.not(a),this.$filteredAtoms=this.$filteredAtoms.not(a);var c=this,d=function(){a.remove(),b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),w.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];return this._getSegments(a),this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var x=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c){x("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(c[a])||a.charAt(0)==="_"){x("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery);
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function ($) {

  var pluses = /\+/g;

  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }

  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }

  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }

  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
    } catch(e) {
      return;
    }

    try {
      // If we can't parse the cookie, ignore it, it's unusable.
      return config.json ? JSON.parse(s) : s;
    } catch(e) {}
  }

  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }

  var config = $.cookie = function (key, value, options) {

    // Write
    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }

      return (document.cookie = [
        encode(key), '=', stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // Read

    var result = key ? undefined : {};

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling $.cookie().
    var cookies = document.cookie ? document.cookie.split('; ') : [];

    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      var name = decode(parts.shift());
      var cookie = parts.join('=');

      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }

      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }

    return result;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== undefined) {
      // Must not alter options, thus extending a fresh object...
      $.cookie(key, '', $.extend({}, options, { expires: -1 }));
      return true;
    }
    return false;
  };

}));
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158; 
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
    return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
;
/*! http://mths.be/placeholder v2.0.7 by @mathias */

;(function(f,h,$){var a='placeholder' in h.createElement('input'),d='placeholder' in h.createElement('textarea'),i=$.fn,c=$.valHooks,k,j;if(a&&d){j=i.placeholder=function(){return this};j.input=j.textarea=true}else{j=i.placeholder=function(){var l=this;l.filter((a?'textarea':':input')+'[placeholder]').not('.placeholder').bind({'focus.placeholder':b,'blur.placeholder':e}).data('placeholder-enabled',true).trigger('blur.placeholder');return l};j.input=a;j.textarea=d;k={get:function(m){var l=$(m);return l.data('placeholder-enabled')&&l.hasClass('placeholder')?'':m.value},set:function(m,n){var l=$(m);if(!l.data('placeholder-enabled')){return m.value=n}if(n==''){m.value=n;if(m!=h.activeElement){e.call(m)}}else{if(l.hasClass('placeholder')){b.call(m,true,n)||(m.value=n)}else{m.value=n}}return l}};a||(c.input=k);d||(c.textarea=k);$(function(){$(h).delegate('form','submit.placeholder',function(){var l=$('.placeholder',this).each(b);setTimeout(function(){l.each(e)},10)})});$(f).bind('beforeunload.placeholder',function(){$('.placeholder').each(function(){this.value=''})})}function g(m){var l={},n=/^jQuery\d+$/;$.each(m.attributes,function(p,o){if(o.specified&&!n.test(o.name)){l[o.name]=o.value}});return l}function b(m,n){var l=this,o=$(l);if(l.value==o.attr('placeholder')&&o.hasClass('placeholder')){if(o.data('placeholder-password')){o=o.hide().next().show().attr('id',o.removeAttr('id').data('placeholder-id'));if(m===true){return o[0].value=n}o.focus()}else{l.value='';o.removeClass('placeholder');l==h.activeElement&&l.select()}}}function e(){var q,l=this,p=$(l),m=p,o=this.id;if(l.value==''){if(l.type=='password'){if(!p.data('placeholder-textinput')){try{q=p.clone().attr({type:'text'})}catch(n){q=$('<input>').attr($.extend(g(this),{type:'text'}))}q.removeAttr('name').data({'placeholder-password':true,'placeholder-id':o}).bind('focus.placeholder',b);p.data({'placeholder-textinput':q,'placeholder-id':o}).before(q)}p=p.removeAttr('id').hide().prev().attr('id',o).show()}p.addClass('placeholder');p[0].value=p.attr('placeholder')}else{p.removeClass('placeholder')}}}(this,document,jQuery));

(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */

(function(k){k.transit={version:"0.9.9",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var d=document.createElement("div");var q={};function b(v){if(v in d.style){return v}var u=["Moz","Webkit","O","ms"];var r=v.charAt(0).toUpperCase()+v.substr(1);if(v in d.style){return v}for(var t=0;t<u.length;++t){var s=u[t]+r;if(s in d.style){return s}}}function e(){d.style[q.transform]="";d.style[q.transform]="rotateY(90deg)";return d.style[q.transform]!==""}var a=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;q.transition=b("transition");q.transitionDelay=b("transitionDelay");q.transform=b("transform");q.transformOrigin=b("transformOrigin");q.transform3d=e();var i={transition:"transitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var f=q.transitionEnd=i[q.transition]||null;for(var p in q){if(q.hasOwnProperty(p)&&typeof k.support[p]==="undefined"){k.support[p]=q[p]}}d=null;k.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};k.cssHooks["transit:transform"]={get:function(r){return k(r).data("transform")||new j()},set:function(s,r){var t=r;if(!(t instanceof j)){t=new j(t)}if(q.transform==="WebkitTransform"&&!a){s.style[q.transform]=t.toString(true)}else{s.style[q.transform]=t.toString()}k(s).data("transform",t)}};k.cssHooks.transform={set:k.cssHooks["transit:transform"].set};if(k.fn.jquery<"1.8"){k.cssHooks.transformOrigin={get:function(r){return r.style[q.transformOrigin]},set:function(r,s){r.style[q.transformOrigin]=s}};k.cssHooks.transition={get:function(r){return r.style[q.transition]},set:function(r,s){r.style[q.transition]=s}}}n("scale");n("translate");n("rotate");n("rotateX");n("rotateY");n("rotate3d");n("perspective");n("skewX");n("skewY");n("x",true);n("y",true);function j(r){if(typeof r==="string"){this.parse(r)}return this}j.prototype={setFromString:function(t,s){var r=(typeof s==="string")?s.split(","):(s.constructor===Array)?s:[s];r.unshift(t);j.prototype.set.apply(this,r)},set:function(s){var r=Array.prototype.slice.apply(arguments,[1]);if(this.setter[s]){this.setter[s].apply(this,r)}else{this[s]=r.join(",")}},get:function(r){if(this.getter[r]){return this.getter[r].apply(this)}else{return this[r]||0}},setter:{rotate:function(r){this.rotate=o(r,"deg")},rotateX:function(r){this.rotateX=o(r,"deg")},rotateY:function(r){this.rotateY=o(r,"deg")},scale:function(r,s){if(s===undefined){s=r}this.scale=r+","+s},skewX:function(r){this.skewX=o(r,"deg")},skewY:function(r){this.skewY=o(r,"deg")},perspective:function(r){this.perspective=o(r,"px")},x:function(r){this.set("translate",r,null)},y:function(r){this.set("translate",null,r)},translate:function(r,s){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(r!==null&&r!==undefined){this._translateX=o(r,"px")}if(s!==null&&s!==undefined){this._translateY=o(s,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var r=(this.scale||"1,1").split(",");if(r[0]){r[0]=parseFloat(r[0])}if(r[1]){r[1]=parseFloat(r[1])}return(r[0]===r[1])?r[0]:r},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var r=0;r<=3;++r){if(t[r]){t[r]=parseFloat(t[r])}}if(t[3]){t[3]=o(t[3],"deg")}return t}},parse:function(s){var r=this;s.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,v,u){r.setFromString(v,u)})},toString:function(t){var s=[];for(var r in this){if(this.hasOwnProperty(r)){if((!q.transform3d)&&((r==="rotateX")||(r==="rotateY")||(r==="perspective")||(r==="transformOrigin"))){continue}if(r[0]!=="_"){if(t&&(r==="scale")){s.push(r+"3d("+this[r]+",1)")}else{if(t&&(r==="translate")){s.push(r+"3d("+this[r]+",0)")}else{s.push(r+"("+this[r]+")")}}}}}return s.join(" ")}};function m(s,r,t){if(r===true){s.queue(t)}else{if(r){s.queue(r,t)}else{t()}}}function h(s){var r=[];k.each(s,function(t){t=k.camelCase(t);t=k.transit.propertyMap[t]||k.cssProps[t]||t;t=c(t);if(k.inArray(t,r)===-1){r.push(t)}});return r}function g(s,v,x,r){var t=h(s);if(k.cssEase[x]){x=k.cssEase[x]}var w=""+l(v)+" "+x;if(parseInt(r,10)>0){w+=" "+l(r)}var u=[];k.each(t,function(z,y){u.push(y+" "+w)});return u.join(", ")}k.fn.transition=k.fn.transit=function(z,s,y,C){var D=this;var u=0;var w=true;if(typeof s==="function"){C=s;s=undefined}if(typeof y==="function"){C=y;y=undefined}if(typeof z.easing!=="undefined"){y=z.easing;delete z.easing}if(typeof z.duration!=="undefined"){s=z.duration;delete z.duration}if(typeof z.complete!=="undefined"){C=z.complete;delete z.complete}if(typeof z.queue!=="undefined"){w=z.queue;delete z.queue}if(typeof z.delay!=="undefined"){u=z.delay;delete z.delay}if(typeof s==="undefined"){s=k.fx.speeds._default}if(typeof y==="undefined"){y=k.cssEase._default}s=l(s);var E=g(z,s,y,u);var B=k.transit.enabled&&q.transition;var t=B?(parseInt(s,10)+parseInt(u,10)):0;if(t===0){var A=function(F){D.css(z);if(C){C.apply(D)}if(F){F()}};m(D,w,A);return D}var x={};var r=function(H){var G=false;var F=function(){if(G){D.unbind(f,F)}if(t>0){D.each(function(){this.style[q.transition]=(x[this]||null)})}if(typeof C==="function"){C.apply(D)}if(typeof H==="function"){H()}};if((t>0)&&(f)&&(k.transit.useTransitionEnd)){G=true;D.bind(f,F)}else{window.setTimeout(F,t)}D.each(function(){if(t>0){this.style[q.transition]=E}k(this).css(z)})};var v=function(F){this.offsetWidth;r(F)};m(D,w,v);return this};function n(s,r){if(!r){k.cssNumber[s]=true}k.transit.propertyMap[s]=q.transform;k.cssHooks[s]={get:function(v){var u=k(v).css("transit:transform");return u.get(s)},set:function(v,w){var u=k(v).css("transit:transform");u.setFromString(s,w);k(v).css({"transit:transform":u})}}}function c(r){return r.replace(/([A-Z])/g,function(s){return"-"+s.toLowerCase()})}function o(s,r){if((typeof s==="string")&&(!s.match(/^[\-0-9\.]+$/))){return s}else{return""+s+r}}function l(s){var r=s;if(k.fx.speeds[r]){r=k.fx.speeds[r]}return o(r,"ms")}k.transit.getTransitionValue=g})(jQuery);
if(!this.JSON)this.JSON={};
(function(){function k(a){return a<10?"0"+a:a}function o(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(a){var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,i){var c,d,h,m,g=e,f,b=i[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof j==="function"&&(b=j.call(i,a,b));switch(typeof b){case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);
case "object":if(!b)return"null";e+=n;f=[];if(Object.prototype.toString.apply(b)==="[object Array]"){m=b.length;for(c=0;c<m;c+=1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(j&&typeof j==="object"){m=j.length;for(c=0;c<m;c+=1)d=j[c],typeof d==="string"&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h)}else for(d in b)Object.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+
g+"}":"{"+f.join(",")+"}";e=g;return h}}if(typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},j;if(typeof JSON.stringify!=="function")JSON.stringify=function(a,i,c){var d;n=e="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else typeof c==="string"&&(n=c);if((j=i)&&typeof i!=="function"&&(typeof i!=="object"||typeof i.length!=="number"))throw Error("JSON.stringify");return l("",
{"":a})};if(typeof JSON.parse!=="function")JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&typeof b==="object")for(g in b)Object.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();
DS.LSSerializer = DS.JSONSerializer.extend({

  addBelongsTo: function(data, record, key, association) {
    data[key] = record.get(key + '.id');
  },

  addHasMany: function(data, record, key, association) {
    data[key] = record.get(key).map(function(record) {
      return record.get('id');
    });
  },

  // extract expects a root key, we don't want to save all these keys to
  // localStorage so we generate the root keys here
  extract: function(loader, json, type, record) {
    this._super(loader, this.rootJSON(json, type), type, record);
  },

  extractMany: function(loader, json, type, records) {
    this._super(loader, this.rootJSON(json, type, 'pluralize'), type, records);
  },

  rootJSON: function(json, type, pluralize) {
    var root = this.rootForType(type);
    if (pluralize == 'pluralize') { root = this.pluralize(root); }
    var rootedJSON = {};
    rootedJSON[root] = json;
    return rootedJSON;
  }

});

DS.LSAdapter = DS.Adapter.extend(Ember.Evented, {

  init: function() {
    this._loadData();
  },

  generateIdForRecord: function() {
    return Math.random().toString(32).slice(2).substr(0,5);
  },

  serializer: DS.LSSerializer.create(),

  find: function(store, type, id) {
    var namespace = this._namespaceForType(type);
    this._async(function(){
      var copy = Ember.copy(namespace.records[id]);
      this.didFindRecord(store, type, copy, id);
    });
  },

  findMany: function(store, type, ids) {
    var namespace = this._namespaceForType(type);
    this._async(function(){
      var results = [];
      for (var i = 0; i < ids.length; i++) {
        results.push(Ember.copy(namespace.records[ids[i]]));
      }
      this.didFindMany(store, type, results);
    });
  },

  // Supports queries that look like this:
  //
  //   {
  //     <property to query>: <value or regex (for strings) to match>,
  //     ...
  //   }
  //
  // Every property added to the query is an "AND" query, not "OR"
  //
  // Example:
  //
  //  match records with "complete: true" and the name "foo" or "bar"
  //
  //    { complete: true, name: /foo|bar/ }
  findQuery: function(store, type, query, recordArray) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      var results = this.query(namespace.records, query);
      this.didFindQuery(store, type, results, recordArray);
    });
  },

  query: function(records, query) {
    var results = [];
    var id, record, property, test, push;
    for (id in records) {
      record = records[id];
      for (property in query) {
        test = query[property];
        push = false;
        if (Object.prototype.toString.call(test) == '[object RegExp]') {
          push = test.test(record[property]);
        } else {
          push = record[property] === test;
        }
      }
      if (push) {
        results.push(record);
      }
    }
    return results;
  },

  findAll: function(store, type) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      var results = [];
      for (var id in namespace.records) {
        results.push(Ember.copy(namespace.records[id]));
      }
      this.didFindAll(store, type, results);
    });
  },

  createRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    records.forEach(function(record) {
      this._addRecordToNamespace(namespace, record);
    }, this);
    this._async(function() {
      this._didSaveRecords(store, type, records);
    });
  },

  updateRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      records.forEach(function(record) {
        var id = record.get('id');
        namespace.records[id] = record.serialize({includeId:true});
      }, this);
      this._didSaveRecords(store, type, records);
    });
  },

  deleteRecords: function(store, type, records) {
    var namespace = this._namespaceForType(type);
    this._async(function() {
      records.forEach(function(record) {
        var id = record.get('id');
        delete namespace.records[id];
      });
      this._didSaveRecords(store, type, records);
    });

  },

  dirtyRecordsForHasManyChange: function(dirtySet, parent, relationship) {
    dirtySet.add(parent);
  },

  dirtyRecordsForBelongsToChange: function(dirtySet, child, relationship) {
    dirtySet.add(child);
  },

  // private

  _getNamespace: function() {
    return this.namespace || 'DS.LSAdapter';
  },

  _loadData: function() {
    var storage = localStorage.getItem(this._getNamespace());
    this._data = storage ? JSON.parse(storage) : {};
  },

  _didSaveRecords: function(store, type, records) {
    var success = this._saveData();
    if (success) {
      store.didSaveRecords(records);
    } else {
      records.forEach(function(record) {
        store.recordWasError(record);
      });
      this.trigger('QUOTA_EXCEEDED_ERR', records);
    }
  },

  _saveData: function() {
    try {
      localStorage.setItem(this._getNamespace(), JSON.stringify(this._data));
      return true;
    } catch(error) {
      if (error.name == 'QUOTA_EXCEEDED_ERR') {
        return false;
      } else {
        throw new Error(error);
      }
    }
  },

  _namespaceForType: function(type) {
    var namespace = type.url || type.toString();
    return this._data[namespace] || (
      this._data[namespace] = {records: {}}
    );
  },

  _addRecordToNamespace: function(namespace, record) {
    var data = record.serialize({includeId: true});
    namespace.records[data.id] = data;
  },

  _async: function(callback) {
    var _this = this;
    setTimeout(function(){
      Ember.run(_this, callback);
    }, 1);
  }

});

/**
 * mapSvg 5.5.6 - Interactive Map Plugin
 *
 * Author - Roman S. Stepanov
 * http://codecanyon.net/user/Yatek/portfolio?ref=Yatek
 *
 * Version : 5.5.6
 * Released: March 27, 2013
 *
 * You must purchase Regular or Extended license to use mapSvg plugin.
 * Visit plugin's page @ CodeCanyon: http://codecanyon.net/item/jquery-interactive-svg-map-plugin/1694201
 * Licenses: http://codecanyon.net/licenses/regular_extended
 */


 (function( $ ) {

    var instances = {},
        globalID  = 0,
        userAgent = navigator.userAgent.toLowerCase();

    // Get plugin's path
    var scripts       = document.getElementsByTagName('script');
    var myScript      = scripts[scripts.length - 1].src.split('/');
        myScript.pop();
    var pluginJSURL   =  myScript.join('/')+'/';
        myScript.pop();
    var pluginRootURL =  myScript.join('/')+'/';

    // Check for iPad/Iphone/Andriod
    var touchDevice =
        (userAgent.indexOf("ipad") > -1) ||
        (userAgent.indexOf("iphone") > -1) ||
        (userAgent.indexOf("ipod") > -1) ||
        (userAgent.indexOf("android") > -1);

    var _browser = {};

    _browser.ie = userAgent.indexOf("msie") > -1 ? {} : false;
    if(_browser.ie)
        _browser.ie.old = (navigator.userAgent.match(/MSIE [6-8]/) !== null);

    _browser.firefox = userAgent.indexOf("firefox") > -1;

    if (!String.prototype.trim) {
        String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
    }


    // Create function for retrieving mouse coordinates
    if (touchDevice){
        var mouseCoords = function(e){
            return e.touches[0] ?
            {'x':e.touches[0].pageX, 'y':e.touches[0].pageY} :
            {'x':e.changedTouches[0].pageX, 'y':e.changedTouches[0].pageY};
        };
    }else{
        var mouseCoords = function(e){
            
            //return e.pageX ?
            //{'x':e.pageX, 'y':e.pageY} :
            //{'x':e.clientX + $('html').scrollLeft(), 'y':e.clientY + $('html').scrollTop()};
            return {'x':e.clientX + $(window).scrollLeft(), 'y':e.clientY + $(window).scrollTop()};
            
        };
    }

    // This data is needed for lat-lon to x-y conversions
    var CBK = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472]
    var CEK = [0.7111111111111111, 1.4222222222222223, 2.8444444444444446, 5.688888888888889, 11.377777777777778, 22.755555555555556, 45.51111111111111, 91.02222222222223, 182.04444444444445, 364.0888888888889, 728.1777777777778, 1456.3555555555556, 2912.711111111111, 5825.422222222222, 11650.844444444445, 23301.68888888889, 46603.37777777778, 93206.75555555556, 186413.51111111112, 372827.02222222224, 745654.0444444445, 1491308.088888889, 2982616.177777778, 5965232.355555556, 11930464.711111112, 23860929.422222223, 47721858.844444446, 95443717.68888889, 190887435.37777779, 381774870.75555557, 763549741.5111111]
    var CFK = [40.74366543152521, 81.48733086305042, 162.97466172610083, 325.94932345220167, 651.8986469044033, 1303.7972938088067, 2607.5945876176133, 5215.189175235227, 10430.378350470453, 20860.756700940907, 41721.51340188181, 83443.02680376363, 166886.05360752725, 333772.1072150545, 667544.214430109, 1335088.428860218, 2670176.857720436, 5340353.715440872, 10680707.430881744, 21361414.86176349, 42722829.72352698, 85445659.44705395, 170891318.8941079, 341782637.7882158, 683565275.5764316, 1367130551.1528633, 2734261102.3057265, 5468522204.611453, 10937044409.222906, 21874088818.445812, 43748177636.891624]

    // Default options
    var defaults = {
        keepSourceStyles    : false,
        loadingText         : 'Loading map...',
        //colors              : {base: "#E1F1F1", background: "#eeeeee", hover: "#548eac", selected: "#065A85", stroke: "#7eadc0"},
        colors              : {background: "#eeeeee", selected: 5, hover: 2},
        regions             : {},
        viewBox             : [],
        cursor              : 'default',
        scale               : 1,
        tooltipsMode        : 'hover',
        tooltips            : {show: 'hover', mode: 'names'},
        onClick             : null,
        mouseOver           : null,
        mouseOut            : null,
        disableAll          : false,
        hideAll             : false,
        marks               : null,
        hover_mode          : 'brightness',
        selected_mode       : 'brightness',
        hover_brightness    : 1,
        selected_brightness : 5,
        pan                 : false,
        panLimit            : true,
        panBackground       : false,
        zoom                : false,
        popover             : {width: 'auto', height:  'auto'},
        buttons             : true,
        zoomLimit           : [0,5],
        zoomDelta           : 1.2,
        zoomButtons         : {'show': true, 'location': 'right'},
        multiSelect         : false

    };

    // Default mark style
    var markOptions = {attrs: {'cursor': 'pointer', 'src': pluginRootURL+'markers/_pin_default.png'}};


/** Main Class **/
var mapSVG = function(elem, options){

    var _data;

    this.methods = {


        // destroy
        destroy : function(){
            delete instances[_data.$map.attr('id')];
            _data.$map.empty();
            return _this;
        },
        getData : function(){
          return _data;
        },
        // GET SCALE VALUE
        getScale: function(){

            var ratio_def = _data.svgDefault.width / _data.svgDefault.height;
            var ratio_new = _data.options.width / _data.options.height;
            var scale1, scale2;

            var size = _data.options.responsive ? [_data.$map.width(), _data.$map.height()] : [_data.options.width, _data.options.height];

            if(ratio_new < ratio_def ){
            // Calculate scale by height
                scale1 = _data.svgDefault.width / _data.svgDefault.viewBox[2];
                scale2 = size[0] / _data.viewBox[2];
            }else{
            // Calculate scale by width
                scale1 = _data.svgDefault.height / _data.svgDefault.viewBox[3];
                scale2 = size[1] / _data.viewBox[3];
            }

            return (1 - (scale1-scale2));
        },
        fluidResize : function(w,h){

            if(!w || !h){
                w = _data.$map.width();
                h = _data.$map.height();
            }

           _data.R.setSize(w,h);

           _data.scale = _this.getScale();
           _this.marksAdjustPosition();

           //_data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);
        },
        // GET VIEBOX [x,y,width,height]
        getViewBox : function(){
            return _data.viewBox;
        },
        // SET VIEWBOX
        setViewBox : function(v){

            if(typeof v == 'string'){
                var coords = _data.ref[v].getBBox();
                _data.viewBox = [coords.x-5, coords.y-5, coords.width+10, coords.height+10];
                var isZooming = true;
            }else{
                var d = (v && v.length==4) ? v : _data.svgDefault.viewBox;
                var isZooming = parseInt(d[2]) != _data.viewBox[2] || parseInt(d[3]) != _data.viewBox[3];
                _data.viewBox = [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
            }

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            if(isZooming){
                _data.scale = _this.getScale();
                _this.marksAdjustPosition();
                if((_browser.ie && !_browser.ie.old) || _browser.firefox){
                        _this.mapAdjustStrokes();
                }

            }

            return true;
        },
        // SET VIEWBOX BY SIZE
        viewBoxSetBySize : function(width,height){

            _data._viewBox = _this.viewBoxGetBySize(width,height);
            _data.viewBox  = $.extend([],_data._viewBox);
            _data.scale    = _this.getScale();

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            _this.marksAdjustPosition();

            return _data.viewBox;
        },
        viewBoxGetBySize : function(width, height){


            var new_ratio = width / height;
            var old_ratio = _data.svgDefault.viewBox[2] / _data.svgDefault.viewBox[3];

            var vb = $.extend([],_data.svgDefault.viewBox);

            if (new_ratio != old_ratio){
                    vb[2] = width*_data.svgDefault.viewBox[2] / _data.svgDefault.width;
                    vb[3] = height*_data.svgDefault.viewBox[3] / _data.svgDefault.height;

            }

            return vb;
        },
        viewBoxReset : function(){
            _this.setViewBox();
        },
        mapAdjustStrokes : function(){
                $.each(_data.ref, function(i,region){
                    if(region.default_attr['stroke-width'])
                        region.attr( {'stroke-width': region.default_attr['stroke-width'] / _data.scale } );
                });
        },
        // ZOOM
        zoomIn: function(){
            _this.zoom(1);
        },
        zoomOut: function(){
            _this.zoom(-1);
        },
        touchZoomStart : function (touchScale){

            touchZoomStart = _data._scale;
            _data.scale  = _data.scale * zoom_k;
            zoom   = _data._scale;
            _data._scale = _data._scale * zoom_k;


            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            newViewBox[2]  = _data._viewBox[2] / _data._scale;
            newViewBox[3]  = _data._viewBox[3] / _data._scale;

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);

        },
        touchZoomMove : function(){

        },
        touchZoomEnd : function(){

        },
        zoom : function (delta, exact){

            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            if(!exact){
            // check for zoom limit
                var d = delta > 0 ? 1 : -1;
                _data._zoomLevel = _data.zoomLevel;
                _data._zoomLevel += d;
                if(_data._zoomLevel > _data.options.zoomLimit[1] || _data._zoomLevel < _data.options.zoomLimit[0]) return false;

                _data.zoomLevel = _data._zoomLevel;

                var zoom_k = d * _data.options.zoomDelta;
                if (zoom_k < 1) zoom_k = -1/zoom_k;

                _data._scale         = _data._scale * zoom_k;
                newViewBox[2]  = _data._viewBox[2] / _data._scale;
                newViewBox[3]  = _data._viewBox[3] / _data._scale;
            }else{
                _data._scale         = exact;
                newViewBox[2]  = _data.touchZoomStartViewBox[2] / _data._scale;
                newViewBox[3]  = _data.touchZoomStartViewBox[3] / _data._scale;
            }

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = _data.viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);
        },
        //  MARK : UPDATE
        markUpdate : function(mark, data){

            if(data.attrs['src']=="")
                delete data.attrs['src'];
            if(data.attrs['href']=="")
                delete data.attrs['href'];

                var img  = new Image();

                img.onload = function(){

                    data.data.width = this.width;
                    data.data.height = this.height;
                    data.attrs.width = parseFloat(data.data.width/_data.scale).toFixed(2);
                    data.attrs.height = parseFloat(data.data.height/_data.scale).toFixed(2);

                    // we don't want href to be active in edit mode
                    if(options.editMode && data.attrs.href){
                            mark.data('href',data.attrs.href);
                            delete data.attrs.href;
                    }else if(options.editMode && !data.attrs.href){
                            mark.removeData('href');
                    }

                    mark.data(data.data);
                    mark.attr(data.attrs);
                };

                img.src  = data.attrs.src;

        },
        // MARK : DELETE
        markDelete: function(mark){
            mark.remove();
        },
        // MARK : ADD
        markAdd : function(opts, create) {

                // Join default mark options with user-defined options
                var mark = $.extend(true, {}, markOptions, opts);

                if (mark.width && mark.height){

                    return _this.markAddFinalStep(mark, create);

                }else{

                    var img = new Image();


                    img.onload = function(){

                        mark.width = this.width;
                        mark.height = this.height;

                        return _this.markAddFinalStep(mark, create);
                    };

                    img.src = mark.attrs.src;
                }
        },
        markAddFinalStep : function(mark, create){
                // We don't need to open a link in edit mode
                var markAttrs = $.extend(true, {}, mark.attrs);

                var width  = parseFloat(mark.width/_data.scale).toFixed(2);
                var height = parseFloat(mark.height/_data.scale).toFixed(2);


                // Get mark's xy OR convert lat/lon to x/y
                var xy = mark.xy ? mark.xy :
                            (mark.attrs.x ? [mark.attrs.x, mark.attrs.y] :
                                (mark.c ? _this.ll2px(mark) : false)
                             );

                if(!xy) return false;

                if(create){
                    xy[0] = xy[0]/_data.scale - mark.width/(2*_data.scale);
                    xy[1] = (xy[1]-mark.height)/_data.scale;
                }

                xy[0] = parseFloat(xy[0]).toFixed(4);
                xy[1] = parseFloat(xy[1]).toFixed(4);

                if(_data.options.editMode)
                    delete markAttrs.href;


                delete markAttrs.width;
                delete markAttrs.height;


                // Add mark (image)
                var RMark = _data.R.image(mark.attrs.src, xy[0], xy[1], width, height)
                             .attr(markAttrs)
                             .data(mark);
                RMark.mapsvg_type = 'mark';


                if(mark.id)
                    RMark.node.id = mark.id;

                if(!_data.options.editMode){
                    if(!touchDevice){
                        RMark.mousedown(function(e){
                                if(this.data('popover')){

                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });

                        if(_data.options.mouseOver){
                            RMark.mouseover(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }
                        if(_data.options.mouseOut){
                            RMark.mouseout(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }

                    }else{
                        RMark.touchstart(function(e){
                                if(this.attrs.href){
                                    window.location.href = this.attrs.href;
                                }else if(this.data('popover')){
                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });
                    }
                }

                _this.markEventHandlersSet(_data.options.editMode, RMark);
                _data.RMarks.push(RMark);


                // Call edit window
                if(create)
                    _data.options.marksEditHandler.call(RMark);
                else
                    _this.markAdjustPosition(RMark);


                return RMark;

        },
        marksAdjustPosition : function(mark){

            if(!mark && (!_data.RMarks || _data.RMarks.length < 1)) return false;

            // We want a marker "tip" to be on bottom side (like a pin)
            // But Raphael starts to draw an image from left top corner.
            // At the same time we don't want a mark to be scaled in size when map scales;
            // Mark always should stay the same size.
            // In this case coordinates of bottom point of image will vary with map scaling.
            // So we have to calculate the offset.

            var dx, dy;

            for (var m in _data.RMarks.items){
                var w = _data.RMarks.items[m].data('width');
                var h = _data.RMarks.items[m].data('height');
                dx = w/2 - w/(2*_data.scale);
                dy = h - h/_data.scale;
                if(_browser.ie){
                    w  = parseInt(w);
                    h  = parseInt(h);
                }

                _data.RMarks.items[m].attr({width: w/_data.scale, height: h/_data.scale}).transform('t'+dx+','+dy);
            }

        },
        markAdjustPosition : function(mark){
                var w = mark.data('width');
                var h = mark.data('height');
                var dx = w/2 - w/(2*_data.scale);
                var dy = h - h/_data.scale;
                mark.attr({width: w/(_data.scale), height: h/(_data.scale)}).transform('t'+dx+','+dy);
                //mark.transform('t'+dx+','+dy);
        },
        // GET MARK COORDINATES TRANSLATED TO 1:1 SCALE (used when saving new added marks)
        markGetDefaultCoords : function(markX, markY, markWidth, markHeight, mapScale){
            markX       = parseFloat(markX);
            markY       = parseFloat(markY);
            markWidth   = parseFloat(markWidth);
            markHeight  = parseFloat(markHeight);
            markX       = parseFloat(markX + markWidth/(2*mapScale) - markWidth/2).toFixed(2);
            markY       = parseFloat(markY + markHeight/mapScale - markHeight).toFixed(2);
            return [markX, markY];
        },
        // MARK MOVE & EDIT HANDLERS
        markMoveStart : function(){
            // storing original coordinates
            this.data('ox', parseFloat(this.attr('x')));
            this.data('oy', parseFloat(this.attr('y')));
        },
        markMove : function (dx, dy) {
            dx = dx/_data.scale;
            dy = dy/_data.scale;
            this.attr({x: this.data('ox') + dx, y: this.data('oy') + dy});
        },
        markMoveEnd : function () {
            // if coordinates are same then it was a "click" and we should start editing
            if(this.data('ox') == this.attr('x') && this.data('oy') == this.attr('y')){
               options.marksEditHandler.call(this);
            }
        },
        panStart : function (e){


                if(e.target.id == 'btnZoomIn' || e.target.id == 'btnZoomOut')
                    return false;

                e.preventDefault();
                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                _data.pan = {};

                // initial viewbox when panning started
                _data.pan.vxi = _data.viewBox[0];
                _data.pan.vyi = _data.viewBox[1];
                // mouse coordinates when panning started
                _data.pan.x  = ce.clientX;
                _data.pan.y  = ce.clientY;
                // mouse delta
                _data.pan.dx = 0;
                _data.pan.dy = 0;
                // new viewbox x/y
                _data.pan.vx = 0;
                _data.pan.vy = 0;

                if(!touchDevice)
                    $('body').on('mousemove', _this.panMove).on('mouseup', _this.panEnd);
        },
        panMove :  function (e){

                e.preventDefault();

                _data.isPanning = true;

                _data.RMap.attr({'cursor': 'move'});
                $('body').css({'cursor': 'move'});

                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                // delta x/y
                _data.pan.dx = (_data.pan.x - ce.clientX);
                _data.pan.dy = (_data.pan.y - ce.clientY);

                // new viewBox x/y
                var vx = parseInt(_data.pan.vxi + _data.pan.dx /_data.scale);
                var vy = parseInt(_data.pan.vyi + _data.pan.dy /_data.scale);

                // Limit pan to map's boundaries
                if(_data.options.panLimit){
                    if(vx < _data.svgDefault.viewBox[0])
                        vx = _data.svgDefault.viewBox[0];
                    else if(_data.viewBox[2] + vx > _data.svgDefault.viewBox[2])
                        vx = _data.svgDefault.viewBox[2]-_data.viewBox[2];

                    if(vy < _data.svgDefault.viewBox[1])
                        vy = _data.svgDefault.viewBox[1];
                    else if(_data.viewBox[3] + vy > _data.svgDefault.viewBox[3])
                        vy = _data.svgDefault.viewBox[3]-_data.viewBox[3];
                }

                _data.pan.vx = vx;
                _data.pan.vy = vy;


                // set new viewBox
                _this.setViewBox([_data.pan.vx,  _data.pan.vy, _data.viewBox[2], _data.viewBox[3]]);

        },
        panEnd : function (e){

                _data.isPanning = false;

                // call regionClickHandler if mouse did not move more than 5 pixels
                if (_data.region_clicked && Math.abs(_data.pan.dx)<5 && Math.abs(_data.pan.dy)<5)
                    _this.regionClickHandler(e, _data.region_clicked);

                $('body').css({'cursor': 'default'});
                _data.RMap.attr({'cursor': _data.options.cursor});

                _data.viewBox[0] = _data.pan.vx || _data.viewBox[0];
                _data.viewBox[1] = _data.pan.vy || _data.viewBox[1] ;

                if(!touchDevice)
                    $('body').off('mousemove', _this.panMove).off('mouseup', _this.panEnd);
        },
        // REMEMBER WHICH REGION WAS CLICKED BEFORE START PANNING
        panRegionClickHandler : function (e, region) {
                _data.region_clicked = region;
        },
        touchStart : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length == 2){
                _data.touchZoomStartViewBox = _data.viewBox;
                _data.touchZoomStart =  _data.scale;
                _data.touchZoomEnd   =  1;
            }else{
                _this.panStart(e);
                _data.isPanning = true;
            }
        },
        touchMove : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length >= 2){
                _this.zoom(null, e.scale);
                _data.isPanning = false;
            }else if(_data.isPanning){
                _this.panMove(e);
            }
        },
        touchEnd : function (e){
            e.preventDefault();
                if(_data.touchZoomStart){
                   _data.touchZoomStart  = false;
                   _data.touchZoomEnd    = false;
                }else if(_data.isPanning){
                    _this.panEnd(e);
                }
        },
        marksHide : function(){
            _data.RMarks.hide();
        },
        marksShow : function(){
            _data.RMarks.show();
        },
        // GET ALL MARKS
        marksGet : function(){
            var _marks = [];
            $.each(_data.RMarks, function(i, m){
                    if(m.attrs){
                    // If mark exist
                        var attrs = $.extend({},m.attrs);
                        if(!m.data('placed')){
                            var xy = _this.markGetDefaultCoords(m.attrs.x, m.attrs.y, m.data('width'), m.data('height'), _data.scale);
                            attrs.x = xy[0];
                            attrs.y = xy[1];
                        }

                        if(m.data('href'))
                            attrs.href = m.data('href');

                        _marks.push({
                            attrs:    attrs,
                            tooltip:  m.data('tooltip'),
                            popover:  m.data('popover'),
                            width:    m.data('width'),
                            height:   m.data('height'),
                            href:     m.data('href'),
                            placed:   true
                        });
                    }
            });
            return _marks;
        },
        // GET SELECTED REGION OR ARRAY OF SELECTED REGIONS
        getSelected : function(){
            return _data.selected_id;
        },
        // SELECT REGION
        selectRegion :    function(id){
                if(!_data.ref[id] || _data.ref[id].disabled) return false;
                
                if(_data.options.multiSelect){
                // if multi select is ON
                    var i = $.inArray(id, _data.selected_id);

                    if(i >= 0){
                    // if selected, deselect
                        _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
                        _data.selected_id.splice(i,1);
                        return;
                    }else{
                    // select
                        _data.selected_id.push(id);
                    }
                }else{
                // single select
                    if(_data.selected_id){
                        _data.ref[_data.selected_id].attr(_data.ref[_data.selected_id].default_attr);
                        if(_browser.ie && !_browser.ie.old)
                            _this.mapAdjustStrokes();
                    }
                        
                        
                    
                    _data.selected_id = id;
                }

                _data.ref[id].attr(_data.ref[id].selected_attr);

        },
        // UNHIGHLIGHT REGION
        unhighlightRegion :   function(id){

                if(_data.ref[id].disabled
                   || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                   || _data.selected_id == id
                   ) return false;

                _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
        },
        // HIGHLIGHT REGION
        highlightRegion : function(id){
                if(_data.isPanning
                    || _data.ref[id].disabled
                    || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                    || _data.selected_id == id
                   )
                    return false;

                _data.ref[id].attr(_data.ref[id].hover_attr);
        },
        // CONVERT LAT/LON TO X/Y (works only with world_high.svg map!)
        ll2px : function(mark){

                var latlng = mark.c;

                var lat = parseFloat(latlng[0]);
                var lng = parseFloat(latlng[1]);

                var czoom = 2;

                var cbk = CBK[czoom];
                //var scale = options.width/1024;
                var scale_ = 1;

                var x = Math.round(cbk + (lng * CEK[czoom]));

                var foo = Math.sin(lat * 3.14159 / 180)
                if (foo < -0.9999)
                    foo = -0.9999;
                else if (foo > 0.9999)
                    foo = 0.9999;

                var y = Math.round(cbk + (0.5 * Math.log((1+foo)/(1-foo)) * (-CFK[czoom])));

                var coordsXY  = [x-(33.8+(mark.width/2)), y-(141.7+mark.height)];

                return coordsXY;
       },
       // CHECK IF REGION IS DISABLED
       isRegionDisabled : function (name, svgfill){
            if(_data.options.regions[name] && (_data.options.regions[name].disabled || svgfill == 'none') ){
                return true;
            }else if(_data.options.disableAll || svgfill == 'none' || name == 'labels' || name == 'Labels'){
                return true;
            }else{
                return false;
            }
       },
       regionClickHandler : function(e, region){

            if(!region) return false;

            _data.region_clicked = null;
            _this.selectRegion(region.name);
            _this.hidePopover();

            if(region.popover)
                _this.showPopover(e, region.popover);

            if(_data.options.onClick)
                return _data.options.onClick.call(region, e, _this);

            if(touchDevice && region.attrs.href)
                window.location.href = region.attrs.href;

       },
       renderSVGPath : function (item, parentTransform, parentStyle){
        
          var path = _data.R.path($(item).attr('d'));          
          var rObj = _this.initRaphaelObject( path, item, parentTransform, parentStyle);

          _this.regionAdd(rObj);
       },
       renderSVGImage: function (item, parentTransform, parentStyle){

          var src = $(item).attr('xlink:href'),
              x   = $(item).attr('x') || 0,
              y   = $(item).attr('y') || 0,
              w   = $(item).attr('width') || 0,
              h   = $(item).attr('height') || 0;
          
          if (!_this.fileExists(src))
            return false;
             
          var rObj = _data.R.image(src, x, y, w, h)
         _this.initRaphaelObject( rObj, item, parentTransform, parentStyle );
          return rObj;
       },
       renderSVGPolygon : function (item, parentTransform, parentStyle){
          //var points = item.getAttribute('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var points = item.attr('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var x0 = points.shift(),
              y0 = points.shift();
          var pathdata = 'M'+x0+','+y0+' L'+points.join(' ')+'z';
          var rObj = _this.initRaphaelObject( _data.R.path(pathdata), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGPolyline : function (item, parentTransform, parentStyle){
          //var points = item.getAttribute('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var points = item.attr('points').trim().replace(/ +(?= )/g,'').split(/\s+|,/);
          var x0 = points.shift(),
              y0 = points.shift();
          var pathdata = 'M'+x0+','+y0+' L'+points.join(' ');
          var rObj = _this.initRaphaelObject( _data.R.path(pathdata), item, parentTransform, parentStyle);
          return rObj;          
       },
       renderSVGCircle: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('cx') || 0,
              y   = $(item).attr('cy') || 0;
              r   = $(item).attr('r')  || 0;
          var rObj = _this.initRaphaelObject( _data.R.circle(x,y,r), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGEllipse: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('cx') || 0,
              y   = $(item).attr('cy') || 0;
              rx  = $(item).attr('rx')  || 0;
              ry  = $(item).attr('ry')  || 0;
          var rObj = _this.initRaphaelObject( _data.R.ellipse(x,y,rx,ry), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGRect: function (item, parentTransform, parentStyle){
          var x   = $(item).attr('x') || 0,
              y   = $(item).attr('y') || 0,
              w   = $(item).attr('width') || 0,
              h   = $(item).attr('height') || 0;
              r   = $(item).attr('rx') || $(item).attr('ry') || 0;
          var rObj = _this.initRaphaelObject( _data.R.rect(x,y,w,h,r), item, parentTransform, parentStyle);
          _this.regionAdd(rObj);
          return rObj;          
       },
       renderSVGText : function (textObj){

            var tspans = $(textObj).find('tspan');

            var x = parseFloat($(textObj).attr('x')) || 0;
            var y = parseFloat($(textObj).attr('y')) || 0;

            tspans.each(function(i,tspan){
                var t = _this.renderSVGTspan($(tspan), {x: x, y: y});
                
                t.attr(_this.styleSVG2Raphael(textObj));
                t.attr(_this.styleSVG2Raphael($(tspan)));
                
                t.transform( _this.transformSVG2Raphael(textObj) );
                t.transform( _this.transformSVG2Raphael($(tspan)));                
            });

            if(tspans.length == 0){
                var t = _this.renderSVGTspan(textObj);
                t.attr(_this.styleSVG2Raphael(textObj));
                t.transform( _this.transformSVG2Raphael(textObj) );
            }
            
          return t;
       },
       renderSVGTspan : function (textObj, parent){
        
            parent = parent || {x: 0, y: 0};

            var x = parseFloat($(textObj).attr('x')) || parent.x;
            var y = parseFloat($(textObj).attr('y')) || parent.y;

            if($(textObj).attr('dx'))
                x += parent.x + $(textObj).attr('dx');
            if($(textObj).attr('dy'))
                y += parent.y + $(textObj).attr('dy');

            text = $(textObj).text();
            

            var rObj = _data.R.text(x, y, text).attr({'text-anchor': 'start'});

            rObj.mapsvg_type = 'text';

            $(rObj.node).css({
              "-webkit-touch-callout": "none",
              "-webkit-user-select": "none",
                'pointer-events': 'none'
            });
          return rObj;            
       },
       initRaphaelObject : function (rObj, svgItem, parentTransform, parentStyle){
  
          var _parentStyle        = parentStyle || {};
          var _parentTransform    = parentTransform || ''; 
          rObj.id            = $(svgItem).attr('id') || rObj.type+(globalID++);
          rObj.node.id       = rObj.id;
          rObj.name          = rObj.id;
          
          var style = _this.styleSVG2Raphael(svgItem, parentStyle);
          
          rObj.attr(style);
          var transform = _this.transformSVG2Raphael(svgItem) + _parentTransform;
          rObj.transform(transform);
          return rObj;
       },
       styleSVG2Raphael : function(svgItem, parentStyle){
            var parentStyle = parentStyle || {};
            var style       = {};
            var attrs       = $(svgItem).get(0).attributes;
            var style_attrs = ["fill","fill-opacity","opacity", "font","font-name","font-family","font-size","font-weight","stroke","stroke-lincap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width"];

            if($(svgItem).attr('style')){
                var _style = $(svgItem).attr('style').split(';');
                    $.each(_style, function(i, val){
                        
                        var p = val.split(':');
                        p[0] = p[0].trim();
                        if(p[1])
                            p[1] = p[1].trim();
                        if(p[0]=='font-size')
                            p[1] = parseInt(p[1].replace('px',''));
                        if(_this.isNumber(p[0]))
                            p[1] = parseFloat(p[1]);                        
                        style[p[0]] = p[1];
                    });
            }

            if(attrs)    
            $.each(attrs, function(i,attr){
               if ($.inArray(attr.name, style_attrs) > -1){
                    if(attr.name=='font-size'){
                        attr.value = parseInt(attr.value.replace('px',''));
                    }
                    style[attr.name] = attr.value;
               }
            });

            if(style['font-size']){
                style['font-size'] = parseInt(style['font-size']);
            }
            
            // Combine with parent styles
            var final_style = $.extend({}, parentStyle, style); 

            if(final_style['stroke']==undefined && final_style['fill']==undefined){                
                final_style['stroke'] = 'none';
                final_style['fill'] = "#000000";                
            }else if (final_style['stroke']==undefined){
                final_style['stroke'] = 'none';
            }else if(final_style['fill']==undefined){
                final_style['fill'] = 'none';
            }
            
            return final_style;
       },
       transformSVG2Raphael : function(svgItem){
            
        
            var _transform = $(svgItem).attr('transform');
            

            if(_transform){

                var tparts = _transform.split(')');
                
                tparts = jQuery.makeArray(tparts);
                
                var rtransform = [];

                for (t in tparts){
                    if(tparts[t] != "" && typeof tparts[t] === "string"){
                        
                        var kv = tparts[t].split('(');

                        if (kv[0]!='matrix'){
                            kv[0] = kv[0].slice(0,1).toLowerCase();
                            rtransform.push(kv[0]+kv[1]);
                        }else{
                            m = kv[1].split(',');
                            var transform_string = Raphael.matrix(parseFloat(m[0]),parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]),parseFloat(m[4]),parseFloat(m[5])).toTransformString();
                            rtransform.push(transform_string);
                        }
                    }
                }

                return rtransform.join();
            }
            return '';        
       },
       // GET ELEMENT'S STYLES (fill, strokes etc..)
       getElementStyles : function (elem){
            if(!_browser.ie){
                return elem.style;
            }else{
                var styles = {};
                styles.getPropertyValue = function(v){
                    return styles[v] || undefined;
                };
                if($(elem).attr('style')){
                    var def_styles = $(elem).attr('style').split(';');
                    $.each(def_styles, function(i, val){
                        var p = val.split(':');
                        styles[p[0]] = p[1];
                    });
                }
                return styles;
            }
       },
       fileExists : function(url){
            if(url.substr(0,4)=="data") 
                return true;
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            return http.status!=404;
       },
       // ADD REGION (PARSE SVG DATA)
       regionAdd : function (_item){

            var name                      = _item.name;
            _data.ref[name]               = _item;
            _data.ref[name].disabled      = _this.isRegionDisabled(name, _item.attr('fill'));
            _data.ref[name].default_attr  = {};

            _data.ref[name].default_attr['fill']         = _item.attr('fill') || 'none';

            if(_data.ref[name].default_attr['fill'] && _data.ref[name].default_attr['fill'] != 'none' && _data.options.colors.base)
                _data.ref[name].default_attr['fill'] = _data.options.colors.base;


            if(_item.attr('stroke'))
                _data.ref[name].default_attr['stroke'] = _item.attr('stroke');

                
            if(_item.attr('stroke-width'))
                _data.ref[name].default_attr['stroke-width'] = parseFloat(_item.attr('stroke-width'));

            if(_data.ref[name].default_attr['stroke'] && _data.ref[name].default_attr['stroke'] != 'none' && _data.options.colors.stroke)
                    _data.ref[name].default_attr['stroke'] = _data.options.colors.stroke;
                    
            if(_data.ref[name].default_attr['stroke-width'] && _data.options.strokeWidth)
                    _data.ref[name].default_attr['stroke-width'] = parseFloat(_data.options.strokeWidth);

            _data.ref[name].selected_attr = {};
            _data.ref[name].hover_attr = {};

            // Set cursor
            if(_data.ref[name].disabled){
                _data.ref[name].default_attr.cursor = 'default';
                $(_data.ref[name].node).css({'pointer-events' :'none'});
            }else{
                _data.ref[name].default_attr.cursor = _data.options.cursor;
            }

            if(_data.options.regions[name]){
                // Set attributes (colors, href, etc..)
                if(_data.options.regions[name].attr)
                    _data.ref[name].default_attr = $.extend(true, {}, _data.ref[name].default_attr, _data.options.regions[name].attr);
                // Set tooltip
                if(_data.options.regions[name].tooltip)
                    _data.ref[name].tooltip = _data.options.regions[name].tooltip;
                // Set popover
                if(_data.options.regions[name].popover)
                    _data.ref[name].popover = _data.options.regions[name].popover;
                // Add custom data
                if(_data.options.regions[name].data)
                    _data.ref[name].data(options.regions[name].data);
            }

            if(_this.isNumber(_data.options.colors.selected))                
                _data.ref[name].selected_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, parseFloat(_data.options.colors.selected));
            else
                _data.ref[name].selected_attr['fill'] = _data.options.colors.selected;                

            if(_this.isNumber(_data.options.colors.hover))
                _data.ref[name].hover_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, parseFloat(_data.options.colors.hover));                
            else
                _data.ref[name].hover_attr['fill'] = _data.options.colors.hover;
                



            // If stroke is dashed, convert it to simple: - - - - -
            var dash = _item.attr('stroke-dasharray');
            if( dash && dash!='none')
                _data.ref[name].default_attr['stroke-dasharray'] = '--';

            _data.ref[name].attr(_data.ref[name].default_attr);

            // Make stroke-width always the same:
            if(!_browser.ie && !_browser.firefox)
                $(_data.ref[name].node).css({'vector-effect' : 'non-scaling-stroke'});

            // Add region to Raphael.set()
            _data.RMap.push(_data.ref[name]);

            // Should we select the region now?
            if(_data.options.regions[name] && _data.options.regions[name].selected)
                _this.selectRegion(name);
        },

        /** Lighten / Darken color
         *  Taken from http://stackoverflow.com/questions/801406/c-create-a-lighter-darker-color-based-on-a-system-color/801463#801463
         */

        lighten2: function(hexColor, factor){
                var h = (hexColor.charAt(0)=="#") ? hexColor.substring(1,7) : hexColor;
                var hsb = Raphael.rgb2hsb(parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16));
                hsb.b += .1;
                return Raphael.hsb(hsb);
        },
        lighten: function ( hexColor, delta ){

            if(!hexColor) return false;

            delta = parseInt(delta)*0.008;

            var rgb = Raphael.getRGB(hexColor);
            var hsb = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);

            var b   = hsb.b + delta;

            if(b >= 1){
                b = 1;
                hsb.s = hsb.s - delta*1.5;
            }else if (b <= 0){
                b = 0;
            }

            var new_rgb = Raphael.hsb2rgb(hsb.h, hsb.s, b);

            return new_rgb.hex;

        },
        setPan : function(on){
            if(on){
                _data.options.pan = true;
                _data.$map.on('mousedown', _this.panStart);
            }else{
                if(_data.options.pan)
                  _data.$map.off('mousedown', _this.panStart);
                _data.options.pan = false;
            }
        },
        markAddClickHandler : function(e){
            // Don't add marker if marker was clicked
            if($(e.target).is('image')) return false;
            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            var y = e.offsetY == undefined ? e.layerY : e.offsetY;
            _this.markAdd({xy: [x, y]}, true);
        },
        markEventHandlersSet : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                if(_data.options.editMode === false)
                    mark.unhover();
                mark.drag(_this.markMove, _this.markMoveStart, _this.markMoveEnd);

            }else{
                if(_data.options.editMode)
                    mark.undrag();

                mark.hover(
                     function(){
                        if(this.data('tooltip')){
                            _data.mapTip.html( this.data('tooltip') );
                            _data.mapTip.show();
                        }
                     },
                     function(){
                        if(this.data('tooltip'))
                            _data.mapTip.hide();
                });

            }
        },
        setMarksEditMode : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                _data.$map.on('click',_this.markAddClickHandler);
            }else{
                _data.$map.off('click',_this.markAddClickHandler);
            }

            _data.options.editMode = on;
        },
        setZoom : function (on){
            if(on){
                _data.options.zoom = true;
                _data.$map.bind('mousewheel.mapsvg',function(event, delta, deltaX, deltaY) {
                    var d = delta > 0 ? 1 : -1;
                    _this.zoom(d);
                    return false;
                });

                // Add zoom buttons
                if(_data.options.zoomButtons.show){

                    var buttons = $('<div></div>');

                    var cssBtn = {'border-radius': '3px', 'display': 'block', 'margin-bottom': '7px'};

                    var btnZoomIn = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhElEQVR4nJWTT4rqQBDGf92pSEJWmYfgQpABb+EB1NU8DyBe5M1q5iKStTCDd/AWggElC3EQJAQxbb/NJDH+mccraEh31fdVfR8pBRBF0Uuapn+AX8CZn0MDuyAI3sfj8aeaTqcvWZZ9XFdZazmdTgC4rotS6oYpCILfkmXZ6yNwt9tFKcVyucRxnBuSNE1fNfB0TWCModlsMhwOGQwGdDod8jy/J+dJP9JsjKl9W2vvlZ3lcuyiS57ntY7FvZDgum6Zk0vN7XYbay3GGMIwLItarRbGGEQErTVxHON5XkVQAEaj0b0x6fV6tXsURRwOBxzHQd9F/CPO58o2ARARdrsds9ms9CIMQ/r9PgCLxYL1eo3rulhr2e/3dQkAnueRJElp2vF4LLskScJmsynNK8A1AqjcVUohUqVEBBGpuV+E/j63CV093/sLizIBvoDny1fHcdhut8znc5RSrFar2kQX8aV933+7ZldK0Wg0iOO4BD9YpjcF8L2R/7XOvu+/TyaTz79+UqnWsVHWHAAAAABJRU5ErkJggg==" id="btnZoomIn"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomIn();
                    }).css(cssBtn);

                    var btnZoomOut = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVR4nKWTPW6DQBBG3w4RaLXSFs4puAe9fQHEReLKPgYN4gLxQei5RNytFraANNEKKwk29uum+N78SKMA2rbdO+c+gHdgYh0Bvowx57IsL6ppmr33/vNO6E+MMQfx3h+fCQM4544C7J4VADvh/s5rTG/LKoTANK37RIQ0TWMdBSEE8jwnyzLmef437L2n7/soiQLnHEVRPDR313VRIA8lVogTWGup6/pmhSRJAFBKxcAwDFhrfwuSJCGEwDiOqx2VUlF8I1h23ILw2h1EgOsLgqtorU/LI23BGHNSAD8fuemdtdbnqqou39SbTK6RdYDsAAAAAElFTkSuQmCC" id="btnZoomOut"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomOut();
                    }).css(cssBtn);

                    buttons.append(btnZoomOut).append(btnZoomIn).css({position: 'absolute', top: '15px', width: '16px', cursor: 'pointer'});

                    if(_data.options.zoomButtons.location == 'right')
                        buttons.css({'right': '15px'});
                    else if(_data.options.zoomButtons.location == 'left')
                        buttons.css({'left': '15px'});

                    _data.zoomButtons = buttons;

                    _data.$map.append(_data.zoomButtons);
                }

            }else{
                if(_data.options.zoom)
                    _data.$map.unbind('mousewheel.mapsvg');
                if(_data.zoomButtons)
                    _data.zoomButtons.hide();
                _data.options.zoom = false;
            }
        },
        setSize : function( width, height, responsive ){

            // Convert strings to numbers
            _data.options.width      = parseInt(width);
            _data.options.height     = parseInt(height);
            _data.options.responsive = _this.parseBoolean(responsive);

            // Calculate width and height
            if ((!_data.options.width && !_data.options.height)){
                _data.options.width  = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }else if (!_data.options.width && _data.options.height){
              _data.options.width  = parseInt(_data.options.height * _data.svgDefault.width / _data.svgDefault.height);
            }else if (_data.options.width && !_data.options.height){
              _data.options.height = parseInt(_data.options.width * _data.svgDefault.height/_data.svgDefault.width);
            }

            if(_data.options.responsive){
                var maxWidth  = _data.options.width;
                var maxHeight = _data.options.height;
                _data.options.width  = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }

            _data.whRatio      = _data.options.width / _data.options.height;
            _data.scale        = _this.getScale();

            if(_data.options.responsive){

                _data.$map.css({
                    'max-width': maxWidth+'px',
                    'max-height': maxHeight+'px',
                    'width': 'auto',
                    'height': 'auto',
                    'position': 'relative'
                }).height(_data.$map.width()  / _data.whRatio);

                $(window).bind('resize.mapsvg', function(){
                    _data.$map.height(_data.$map.width() / _data.whRatio);
                });
            }else{
                _data.$map.css({
                    'width': _data.options.width+'px',
                    'height': _data.options.height+'px',
                    'max-width': 'none',
                    'max-height': 'none',
                    'position': 'relative'
                });
                $(window).unbind('resize.mapsvg');
            }

            if(!_data.options.responsive && _data.R)
                _data.R.setSize(_data.options.width, _data.options.height);

            return [_data.options.width, _data.options.height];


        },
        // Adding marks
        setMarks : function (marksArr){
            if(marksArr){
                $.each(marksArr, function(i, mark){
                        _this.markAdd(mark);
                });
            }
        },

        // Show tooltip (this function will be defined later in setTooltip method)
        showTip : function(){},
        showPopover : function(){},
        // Hide tooltip
        hideTip : function (){
            _data.mapTip.hide();
            _data.mapTip.html('');
        },
        // Set tooltip behaviour
        setTooltip : function (mode){

            // Add tooltip container
            _data.mapTip = $('<div class="map_tooltip"></div>');
            $("body").append(_data.mapTip);

            _data.mapTip.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #eee',
               'padding': '4px 7px',
               'max-width': '600px'
            });

            if(_data.options.tooltips.show == 'hover'){
                _data.$map.mousemove(function(e) {
                    _data.mapTip.css('left', e.clientX + $(window).scrollLeft()).css('top', e.clientY + $(window).scrollTop() + 30);
                });
            }

            _this.showTip = (_data.options.tooltipsMode == 'custom' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }
                }: _data.options.tooltipsMode == 'names' ?
                function (name){
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                }: _data.options.tooltipsMode == 'combined' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }else{
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                    }
                }: function(name){null;}
            );

        },
        // Set popover behaviour
        setPopover : function (on){

            if(!on) return false;

            // Add tooltip container
            $("body").prepend('<div class="map_popover"><div class="map_popover_content"></div><div class="map_popover_close">x</div></div>');

            _data.mapPopover = $('.map_popover');

            var popoverClose = _data.mapPopover.find('.map_popover_close');


            _data.mapPopover.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'width': _data.options.popover.width+(_data.options.popover.width=='auto'? '': 'px'),
               'height': _data.options.popover.height+(_data.options.popover.height=='auto'? '': 'px'),
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #ccc',
               'padding': '12px',
               '-webkit-box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)',
               'box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)'

            });

            popoverClose.css({
                'position': 'absolute',
                'top': '0',
                'right' : '5px',
                'cursor': 'pointer',
                'color': '#aaa',
                'z-index' : '1200'

            });

            _this.showPopover = function (e, content, pos){

                                    if (!pos || pos.length != 2){
                                        var m   = mouseCoords(e);
                                        var pos = [m.x, m.y];
                                    }

                                    if(content){
                                        _data.mapPopover.find('.map_popover_content').html(content);
                                        var nx = pos[0] - _data.mapPopover.outerWidth(false)/2;
                                        var ny = pos[1] - _data.mapPopover.outerHeight(false) - 7;
                                        if(nx<0) nx = 0;
                                        if(ny<0) ny = 0;

                                        if(nx+_data.mapPopover.outerWidth(false) > $(window).scrollLeft() + $(window).width()) nx = ($(window).scrollLeft() + $(window).width()) - _data.mapPopover.outerWidth(false);
                                        if(ny+_data.mapPopover.outerHeight(false) > $(window).scrollTop() + $(window).height()) ny = ($(window).scrollTop() + $(window).height()) - _data.mapPopover.outerHeight(false);
                                        if(nx < $(window).scrollLeft()) nx = $(window).scrollLeft();
                                        if(ny < $(window).scrollTop()) ny = $(window).scrollTop();

                                        _data.mapPopover.css('left', nx).css('top', ny);
                                        _data.mapPopover.show();

                                    }
                                  };
            _this.hidePopover = function(){

                _data.mapPopover.find('.map_popover_content').html('');
                _data.mapPopover.hide();

            };

            popoverClose.on('click', _this.hidePopover);

        },
        popoverOffHandler : function(e){
            if(!$(e.target).closest('#map_popover').length)
                _this.hidePopover();
        },
        isNumber : function (n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        },
        parseBoolean : function (string) {
          switch (String(string).toLowerCase()) {
            case "true":
            case "1":
            case "yes":
            case "y":
              return true;
            case "false":
            case "0":
            case "no":
            case "n":
              return false;
            default:
              return undefined;
          }
        },
        mouseOverHandler : function(){},
        mouseOutHandler : function(){},
        mouseDownHandler : function(){},
        // INIT
        init    : function(opts, elem) {

            if(!opts.source) {
                alert('mapSVG Error: Please provide a map URL');
                return false;
            }

            // Cut protocol (http: || https:) - to avoid "cross-domain" error
            if(opts.source.indexOf('http://') == 0 || opts.source.indexOf('https://') == 0)
                opts.source = "//"+opts.source.split("://").pop();

            opts.pan  = _this.parseBoolean(opts.pan);
            opts.zoom = _this.parseBoolean(opts.zoom);
            opts.responsive  = _this.parseBoolean(opts.responsive);
            opts.disableAll  = _this.parseBoolean(opts.disableAll);
            opts.multiSelect = _this.parseBoolean(opts.multiSelect);

            // If veiwBox is set as string region's name (or country name)
            // then we'll calculate veiwBox parameters later
            if(opts.viewBox && typeof opts.viewBox == 'string'){
                opts.viewBoxFind = opts.viewBox;
                delete opts.viewBox;
            }

            /** Setting _data **/
            _data  = {};

            _data.options = $.extend(true, {}, defaults, opts);

            _data.map  = elem;
            _data.$map = $(elem);
            _data.whRatio = 0;
            _data.isPanning = false;
            //_data.showTip = {};
            _data.markOptions = {};
            _data.svgDefault = {};
            _data.mouseDownHandler;
            _data.ref = {};
            _data.refLength = 0;

            _data.scale  = 1;         // absolute scale
            _data._scale = 1;         // relative scale starting from current zoom level

            _data.selected_id   =  _data.options.multiSelect ? [] : 0;
            _data.mapData       = {};
            _data.ref           = {};
            _data.marks         = [];
            _data._viewBox      = []; // initial viewBox
            _data.viewBox       = []; // current viewBox
            _data.viewBoxZoom   = [];
            _data.viewBoxFind   = undefined;
            _data.zoomLevel     = 0;
            _data.pan           = {};
            _data.zoom;
            _data.touchZoomStart;
            _data.touchZoomStartViewBox;
            _data.touchZoomEnd;
            /****/


            // Set background
            _data.$map.css({
                             'background': _data.options.colors.background,
                             'height': '100px',
                             'position' : 'relative'
                           });

            var loading = $('<div>'+_data.options.loadingText+'</div>').css({
                position: 'absolute',
                top:  '50%',
                left: '50%',
                'z-index': 1,
                padding: '7px 10px',
                'border-radius': '5px',
                '-webkit-border-radius': '5px',
                '-moz-border-radius': '5px',
                '-ms-border-radius': '5px',
                '-o-border-radius': '5px',
                'border': '1px solid #ccc',
                background: '#f5f5f2',
                color: '#999'
            });

            _data.$map.append(loading);

            loading.css({
                'margin-left': function () {
                    return -($(this).outerWidth(false) / 2)+'px';
                },
                'margin-top': function () {
                    return -($(this).outerHeight(false) / 2)+'px';
                }
            });


            // GET the map by ajax request
            $.ajax({
                url: _data.options.source,
                contentType: "image/svg+xml; charset=utf-8",
                //dataType: (_browser.ie) ? 'text' : 'xml', // check if IE
                beforeSend: function(x) {
                        if(x && x.overrideMimeType) {
                            x.overrideMimeType("image/svg+xml; charset=utf-8");
                        }
                    },
                success:  function(xmlData){

                    $data = $(xmlData);

                    // Default width/height/viewBox from SVG
                    var svgTag               = $data.find('svg');
                    _data.svgDefault.width   = parseFloat(svgTag.attr('width').replace(/px/g,''));
                    _data.svgDefault.height  = parseFloat(svgTag.attr('height').replace(/px/g,''));
                    _data.svgDefault.viewBox = svgTag.attr('viewBox') ? svgTag.attr('viewBox').split(' ') : [0,0, _data.svgDefault.width, _data.svgDefault.height];

                    $.each(_data.svgDefault.viewBox, function(i,v){
                        _data.svgDefault.viewBox[i] = parseInt(v);
                    });

                    _data._viewBox  = (_data.options.viewBox.length==4) ? _data.options.viewBox : _data.svgDefault.viewBox;

                    $.each(_data._viewBox, function(i,v){
                        _data._viewBox[i] = parseInt(v);
                    });


                    // Set size
                    _this.setSize(_data.options.width, _data.options.height, _data.options.responsive);

                    // Attach Raphael to given jQuery element

                    // IE 7&8 doesn't support responsive size so we just set
                    // width and height in pixels, and then resize it on window.resize event.
                    // For all other cool browsers we just set width and height
                    // to 100% to simply fit DIV container.
                    if(_browser.ie && _browser.ie.old){

                        _data.R = Raphael(_data.$map.attr('id'), _data.options.width, _data.options.height);
                        _data.scale = _this.getScale();

                        if(_data.options.responsive)
                            $(window).on('resize', _this.fluidResize);

                    }else{
                        _data.R = Raphael(_data.$map.attr('id'), '100%', '100%');

                        if(_data.options.responsive){
                            $(window).on('resize', function(e){
                                _data.scale = _this.getScale();
                                _this.marksAdjustPosition();
                            });
                        }
                    }

                    // Adding moving sticky draggable image on background
                    if(_data.options.panBackground)
                        _data.background = _data.R.rect(_data.svgDefault.viewBox[0],_data.svgDefault.viewBox[1],_data.svgDefault.viewBox[2],_data.svgDefault.viewBox[3]).attr({fill: _data.options.colors.background});

                  _data.RMap     = _data.R.set();
                    _data.RMarks   = _data.R.set();

                    // Render each SVG element
                    
                    var parse = function(_item, parentTransform, parentStyle){
                        var type = $(_item).get(0).tagName;
                        
                        switch (type){
                            case 'path':
                                _this.renderSVGPath(_item, parentTransform, parentStyle);
                                break;
                            case 'polygon':
                                _this.renderSVGPolygon(_item, parentTransform, parentStyle);
                                break;
                            case 'polyline':
                                _this.renderSVGPolyline(_item, parentTransform, parentStyle);
                                break;
                            case 'circle':
                                _this.renderSVGCircle(_item, parentTransform, parentStyle);
                                break;
                            case 'ellipse':
                                _this.renderSVGEllipse(_item, parentTransform, parentStyle);
                                break;
                            case 'rect':                            
                                _this.renderSVGRect(_item, parentTransform, parentStyle);
                                break;
                            case 'image':
                                _this.renderSVGImage(_item, parentTransform, parentStyle);
                                break;
                            case 'text':                                
                                _this.renderSVGText(_item, parentTransform, parentStyle);
                                break;
                            default:
                                null;
                                break;
                        }                        
                    };                 
                    
                    var traverse = function (node, parentTransformString, parentStyle){
                        
                        var children = $(node).children();
                        
                        if (children.length){// && !$(node).is('text')) {
                            
                            var nodes = [];
                            
                            parentTransformString = parentTransformString || "";
                            parentTransformString = _this.transformSVG2Raphael(node) + parentTransformString;
                            parentStyle = parentStyle || {};
                            
                            $(node).children().each(function(i,n){
                              var _parentStyle = _this.styleSVG2Raphael(n, parentStyle);
                              traverse($(n), parentTransformString, _parentStyle);
                            });
                            
                        }// else{                
                            parse($(node), parentTransformString, parentStyle);
                        //} 
                            
                    };
                    
                    traverse($data.find('svg'));
                    
                    // Set viewBox
                    var v = _data.options.viewBoxFind || _data._viewBox;
                    _this.setViewBox(v);

                    // If there are markers, put them to the map
                    _this.setMarks(_data.options.marks);
                    _this.setMarksEditMode(_data.options.editMode);

                    // Set panning
                    _this.setPan(_data.options.pan);

                    // Set zooming by mouswheel
                    _this.setZoom(_data.options.zoom);

                    // Set tooltips
                    _this.setTooltip(_data.options.tooltips.mode);

                    // Set popovers
                    _this.setPopover(_data.options.popover);


                    if(_data.options.responsive && _browser.ie && _browser.ie.old)
                        _this.fluidResize();


                    if((_browser.ie && !_browser.ie.old) || _browser.firefox)
                            _this.mapAdjustStrokes();


                    //Create event handlers
                    var funcStr = '';

                    /*
                     * Now let's add event handlers.
                     * Please note that we don't need mouseOver / mouseOut on mobile devices (iPad etc..)
                     */
                    if(!touchDevice){
                        // 1. MouseOver
                        funcStr = 'methods.highlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.showTip(this.name);';
                        if(_data.options.mouseOver)
                            funcStr += 'return options.mouseOver.call(this, e, methods);';

                        _this.mouseOverHandler = new Function('e, methods, options', funcStr);

                        // 2. MouseOut
                        funcStr = '';
                        funcStr += 'methods.unhighlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.hideTip();';
                        if(_data.options.mouseOut)
                            funcStr += 'return options.mouseOut.call(this, e, methods);';
                        _this.mouseOutHandler = new Function('e, methods, options', funcStr);
                    }

                    // 3. MouseDown
                    funcStr = '';
                    funcStr = 'methods.regionClickHandler.call(mapObj, e, this);';
                    _this.mouseDownHandler = new Function('e, methods', funcStr);


                    /* EVENTS */
                    if(!touchDevice){
                      _data.RMap
                            .mouseover( function(e){_this.mouseOverHandler.call(this, e, _this, options);} )
                            .mouseout(  function(e){_this.mouseOutHandler.call(this, e, _this, options);} );
                    }

                    if(!_data.options.pan){
                        _data.RMap.mousedown( function(e){
                            //_this.mouseDownHandler.call(this, e, methods);}
                            _this.regionClickHandler.call(_this, e, this);
                         });
                        _data.RMap.touchstart(
                            function(e){
                                e.preventDefault();
                                _this.regionClickHandler.call(_this, e, this);
                            }
                        );
                    }else{
                        if(!touchDevice){
                            _data.RMap.mousedown( function(e){
                                // While panning we just remember which region was clicked
                                // by panRegionClickHandler method, and then trigger
                                // regionClickHandler on that region when panning finishes
                                e.preventDefault();

                                _this.panRegionClickHandler.call(_this, e, this);
                            });
                        }else{
                            _data.RMap.touchstart(
                                function(e){
                                    _this.panRegionClickHandler.call(_this, e, this);
                                }
                            );
                            _data.R.canvas.addEventListener('touchstart', function(e) {
                                _this.touchStart(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchmove', function(e) {
                                _this.touchMove(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchend', function(e) {
                                _this.touchEnd(e);
                            }, false);
                        }
                    }
                    loading.hide();
                    } // end of AJAX callback
                });// end of AJAX



        return _this;

        } // end of init

   }; // end of methods

   var _this = this.methods;

  }; // end of mapSVG class


  /** $.FN **/
  $.fn.mapSvg = function( opts ) {

    var id = $(this).attr('id');

    if(typeof opts == 'object' && instances[id] === undefined){
        instances[id] = new mapSVG(this, opts);
        return instances[id].methods.init(opts, this);
    }else if(instances[id]){
        return instances[id].methods;
    }else{
        return $(this);
    }

  }; // end of $.fn.mapSvg

})( jQuery );
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */

;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark main meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
var oo=function(a){var b="https://api.oocharts.com/v1/dynamic.jsonp",c=void 0,d={},e={},f={},g={},h={},i=function(){for(var b=function(b){for(var c=[],d=a.getElementsByTagName("*"),e=0;e<d.length;e++)d[e].getAttribute(b)&&c.push(d[e]);return c},c=b("data-oochart"),d=0;d<c.length;d++){var e=c[d],f=e.getAttribute("data-oochart"),g=e.getAttribute("data-oochart-start-date"),h=e.getAttribute("data-oochart-end-date"),i=e.getAttribute("data-oochart-profile");if("metric"===f.toLowerCase()){var j=new u(i,g,h);j.setMetric(e.getAttribute("data-oochart-metric")),j.draw(e)}else if("column"===f.toLowerCase()){for(var k=new v(i,g,h),l=e.getAttribute("data-oochart-metrics"),m=l.split(","),n=0;n<m.length;n++)k.addMetric(m[n],m[n+1]),n+=1;var o=e.getAttribute("data-oochart-dimension");k.setDimension(o),k.draw(e)}else if("timeline"===f.toLowerCase()){for(var p=new w(i,g,h),l=e.getAttribute("data-oochart-metrics"),m=l.split(","),n=0;n<m.length;n++)p.addMetric(m[n],m[n+1]),n+=1;p.draw(e)}else if("bar"===f.toLowerCase()){for(var q=new x(i,g,h),l=e.getAttribute("data-oochart-metrics"),m=l.split(","),n=0;n<m.length;n++)q.addMetric(m[n],m[n+1]),n+=1;var o=e.getAttribute("data-oochart-dimension");q.setDimension(o),q.draw(e)}else if("pie"===f.toLowerCase()){var r=new y(i,g,h),s=e.getAttribute("data-oochart-metric"),o=e.getAttribute("data-oochart-dimension"),j=s.split(",");r.setMetric(j[0],j[1]),r.setDimension(o),r.draw(e)}else if("table"===f.toLowerCase()){for(var t=new z(i,g,h),s=e.getAttribute("data-oochart-metrics"),A=e.getAttribute("data-oochart-dimensions"),m=s.split(","),B=A.split(","),n=0;n<m.length;n++)t.addMetric(m[n],m[n+1]),n+=1;for(var C=0;C<B.length;C++)t.addDimension(B[C],B[C+1]),C+=1;t.draw(e)}}},j=function(b,c){var d=a.createElement("script");d.type="text/javascript",d.src=b,d.async=!1,d.onreadystatechange=d.onload=function(){var a=d.readyState;c.done||a&&!/loaded|complete/.test(a)||(c.done=!0,c())};var e=a.getElementsByTagName("script")[0];e.parentNode.insertBefore(d,e)},k=function(a){if(!c)throw"Set APIKey with oo.setAPIKey before calling load";var b=function(a){"undefined"==typeof google?j("https://www.google.com/jsapi",a):a()},d=function(a){if("undefined"==typeof google.visualization)google.load("visualization","1",{packages:["corechart","table"],callback:a});else{var b=[];"undefined"==typeof google.visualization.corechart&&b.push("corechart"),"undefined"==typeof google.visualization.table&&b.push("table"),b.length>0&&google.load("visualization","1",{packages:b,callback:a})}},e=a;b(function(){d(function(){e&&e(),i()})})},l=function(a){c=a},m=function(a){h=a},n=function(a){g=a},o=function(a){d=a},p=function(a){e=a},q=function(a){f=a},r=function(a){var b=a.getFullYear().toString(),c=(a.getMonth()+1).toString(),a=a.getDate().toString();return 1===c.length&&(c="0"+c),1===a.length&&(a="0"+a),b+"-"+c+"-"+a},s=function(a){a=a.split("-");var b=new Date;return b.setFullYear(a[0],a[1]-1,a[2]),b.setHours(0,0,0,0),b},t=function(a,b,c){if(this.metrics=[],this.dimensions=[],!a)throw new Error("Profile argument required");this.profile=a,b=b||new Date,c=c||new Date,b instanceof Date&&(b=r(b)),c instanceof Date&&(c=r(c));var d=function(a){return/^[0-9]+(m|d|w|y)$/.test(a)},e=function(a){return/^([0-9]{4}-[0-9]{2}-[0-9]{2})$|^[0-9]+(m|d|w|y)$/.test(a)};if(!d(b)&&!e(b))throw new Error("startDate parameter invalid");if(!d(c)&&!e(c))throw new Error("endDate parameter invalid");if(d(b)&&d(c))throw new Error("startDate and endDate cannot both be relative dates");this.startDate=b,this.endDate=c};t.prototype.clearMetrics=function(){this.metrics=[]},t.prototype.clearDimensions=function(){this.dimensions=[]},t.prototype.addMetric=function(a){this.metrics.push(a)},t.prototype.addDimension=function(a){this.dimensions.push(a)},t.prototype.setFilter=function(a){this.filters=a},t.prototype.setSort=function(a){this.sort=a},t.prototype.setSegment=function(a){this.segment=a},t.prototype.setIndex=function(a){this.index=a},t.prototype.setMaxResults=function(a){this.maxResults=a},t.prototype.execute=function(a){var d={};if(d.key=c,d.profile=this.profile,0===this.metrics.length)throw new Error("At least one metric is required");d.metrics=this.metrics.toString(),d.start=this.startDate,d.end=this.endDate,this.dimensions.length>0&&(d.dimensions=this.dimensions.toString()),this.filters&&(d.filters=this.filters),this.sort&&(d.sort=this.sort),this.index&&(d.index=this.index),this.segment&&(d.segment=this.segment),this.maxResults&&(d.maxResults=this.maxResults),JSONP.get(b,d,function(b){0===b.rows.length&&(b.rows=[[]]),a(b)})};var u=function(a,b,c){this.query=new t(a,b,c)};u.prototype.setMetric=function(a){this.query.clearMetrics(),this.query.addMetric(a)},u.prototype.draw=function(b,c){this.query.execute(function(d){var e;e="string"==typeof b?a.getElementById(b):b,e.innerHTML="undefined"!=typeof d.rows[0][0]?d.rows[0][0].toString():"0","undefined"!=typeof c&&c()})};var v=function(a,b,c){this.query=new t(a,b,c),this.metricLabels=[],this.options=h};v.prototype.setOptions=function(a){this.options=a},v.prototype.addMetric=function(a,b){this.metricLabels.push(b),this.query.addMetric(a)},v.prototype.setDimension=function(a){this.query.clearDimensions(),this.query.dimensions.push(a),this.dimensionLabel=a},v.prototype.draw=function(b,c){var d=this;this.query.execute(function(e){var f=e.rows,g=new google.visualization.DataTable;g.addColumn("string",d.dimensionLabel);for(var h=0;h<d.metricLabels.length;h++)g.addColumn("number",d.metricLabels[h]);g.addRows(f);var i;i="string"==typeof b?a.getElementById(b):b;var j=new google.visualization.ColumnChart(i);j.draw(g,d.options),"undefined"!=typeof c&&c()})};var w=function(a,b,c){this.query=new t(a,b,c),this.query.addDimension("ga:date"),this.labels=[],this.options=d};w.prototype.setOptions=function(a){this.options=a},w.prototype.addMetric=function(a,b){this.labels.push(b),this.query.addMetric(a)},w.prototype.draw=function(b,c){var d=this;this.query.execute(function(e){for(var f=e.rows,g=0;g<f.length;g++)f[g][0]=s(f[g][0]);var h=new google.visualization.DataTable;h.addColumn("date","Date");for(var i=0;i<d.labels.length;i++)h.addColumn("number",d.labels[i]);h.addRows(f);var j;j="string"==typeof b?a.getElementById(b):b;var k=new google.visualization.LineChart(j);k.draw(h,d.options),"undefined"!=typeof c&&c()})};var x=function(a,b,c){this.query=new t(a,b,c),this.metricLabels=[],this.options=g};x.prototype.setOptions=function(a){this.options=a},x.prototype.addMetric=function(a,b){this.metricLabels.push(b),this.query.addMetric(a)},x.prototype.setDimension=function(a){this.query.clearDimensions(),this.query.dimensions.push(a),this.dimensionLabel=a},x.prototype.draw=function(b,c){var d=this;this.query.execute(function(e){var f=e.rows,g=new google.visualization.DataTable;g.addColumn("string",d.dimensionLabel);for(var h=0;h<d.metricLabels.length;h++)g.addColumn("number",d.metricLabels[h]);g.addRows(f);var i;i="string"==typeof b?a.getElementById(b):b;var j=new google.visualization.BarChart(i);j.draw(g,d.options),"undefined"!=typeof c&&c()})};var y=function(a,b,c){this.query=new t(a,b,c),this.options=e};y.prototype.setMetric=function(a,b){this.metricLabel=b,this.query.clearMetrics(),this.query.addMetric(a)},y.prototype.setDimension=function(a){this.query.clearDimensions(),this.query.dimensionLabel=a,this.query.addDimension(a)},y.prototype.setOptions=function(a){this.options=a},y.prototype.draw=function(b,c){var d=this;this.query.execute(function(e){var f=e.rows,g=new google.visualization.DataTable;g.addColumn("string",d.dimensionLabel),g.addColumn("number",d.metricLabel),g.addRows(f);var h;h="string"==typeof b?a.getElementById(b):b;var i=new google.visualization.PieChart(h);i.draw(g,d.options),"undefined"!=typeof c&&c()})};var z=function(a,b,c){this.query=new t(a,b,c),this.metricLabels=[],this.dimensionLabels=[],this.options=f};return z.prototype.addMetric=function(a,b){this.query.addMetric(a),this.metricLabels.push(b)},z.prototype.addDimension=function(a,b){this.query.addDimension(a),this.dimensionLabels.push(b)},z.prototype.setOptions=function(a){this.options=a},z.prototype.draw=function(b,c){var d=this;this.query.execute(function(e){for(var f=e.rows,g=[],h=0;h<d.dimensionLabels.length;h++)g.push(d.dimensionLabels[h]);for(var i=0;i<d.metricLabels.length;i++)g.push(d.metricLabels[i]);f.splice(0,0,g);var k,j=google.visualization.arrayToDataTable(f);k="string"==typeof b?a.getElementById(b):b;var l=new google.visualization.Table(k);l.draw(j,d.options),"undefined"!=typeof c&&c()})},{Query:t,Timeline:w,Column:v,Bar:x,Metric:u,Pie:y,Table:z,load:k,formatDate:r,parseDate:s,setAPIKey:l,setBarDefaults:n,setColumnDefaults:m,setTimelineDefaults:o,setPieDefaults:p,setTableDefaults:q}}(document),JSONP=function(a){var b=0,c={};return{get:function(d,e,f){arguments[2]||(f=arguments[1],e={}),d+=d.indexOf("?")+1?"&":"?";var k,g=a.getElementsByTagName("head")[0],h=a.createElement("script"),i=[],j=b;b++,e.callback="JSONP.callbacks.request_"+j,c["request_"+j]=function(a){g.removeChild(h),delete c["request_"+j],f(a)};for(k in e)i.push(k+"="+encodeURIComponent(e[k]));d+=i.join("&"),h.type="text/javascript",h.src=d,g.appendChild(h)},callbacks:c}}(document);
// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(a){var b="0.3.4",c="hasOwnProperty",d=/[\.\/]/,e="*",f=function(){},g=function(a,b){return a-b},h,i,j={n:{}},k=function(a,b){var c=j,d=i,e=Array.prototype.slice.call(arguments,2),f=k.listeners(a),l=0,m=!1,n,o=[],p={},q=[],r=h,s=[];h=a,i=0;for(var t=0,u=f.length;t<u;t++)"zIndex"in f[t]&&(o.push(f[t].zIndex),f[t].zIndex<0&&(p[f[t].zIndex]=f[t]));o.sort(g);while(o[l]<0){n=p[o[l++]],q.push(n.apply(b,e));if(i){i=d;return q}}for(t=0;t<u;t++){n=f[t];if("zIndex"in n)if(n.zIndex==o[l]){q.push(n.apply(b,e));if(i)break;do{l++,n=p[o[l]],n&&q.push(n.apply(b,e));if(i)break}while(n)}else p[n.zIndex]=n;else{q.push(n.apply(b,e));if(i)break}}i=d,h=r;return q.length?q:null};k.listeners=function(a){var b=a.split(d),c=j,f,g,h,i,k,l,m,n,o=[c],p=[];for(i=0,k=b.length;i<k;i++){n=[];for(l=0,m=o.length;l<m;l++){c=o[l].n,g=[c[b[i]],c[e]],h=2;while(h--)f=g[h],f&&(n.push(f),p=p.concat(f.f||[]))}o=n}return p},k.on=function(a,b){var c=a.split(d),e=j;for(var g=0,h=c.length;g<h;g++)e=e.n,!e[c[g]]&&(e[c[g]]={n:{}}),e=e[c[g]];e.f=e.f||[];for(g=0,h=e.f.length;g<h;g++)if(e.f[g]==b)return f;e.f.push(b);return function(a){+a==+a&&(b.zIndex=+a)}},k.stop=function(){i=1},k.nt=function(a){if(a)return(new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)")).test(h);return h},k.off=k.unbind=function(a,b){var f=a.split(d),g,h,i,k,l,m,n,o=[j];for(k=0,l=f.length;k<l;k++)for(m=0;m<o.length;m+=i.length-2){i=[m,1],g=o[m].n;if(f[k]!=e)g[f[k]]&&i.push(g[f[k]]);else for(h in g)g[c](h)&&i.push(g[h]);o.splice.apply(o,i)}for(k=0,l=o.length;k<l;k++){g=o[k];while(g.n){if(b){if(g.f){for(m=0,n=g.f.length;m<n;m++)if(g.f[m]==b){g.f.splice(m,1);break}!g.f.length&&delete g.f}for(h in g.n)if(g.n[c](h)&&g.n[h].f){var p=g.n[h].f;for(m=0,n=p.length;m<n;m++)if(p[m]==b){p.splice(m,1);break}!p.length&&delete g.n[h].f}}else{delete g.f;for(h in g.n)g.n[c](h)&&g.n[h].f&&delete g.n[h].f}g=g.n}}},k.once=function(a,b){var c=function(){var d=b.apply(this,arguments);k.unbind(a,c);return d};return k.on(a,c)},k.version=b,k.toString=function(){return"You are running Eve "+b},typeof module!="undefined"&&module.exports?module.exports=k:typeof define!="undefined"?define("eve",[],function(){return k}):a.eve=k})(this),function(){function cF(a){for(var b=0;b<cy.length;b++)cy[b].el.paper==a&&cy.splice(b--,1)}function cE(b,d,e,f,h,i){e=Q(e);var j,k,l,m=[],o,p,q,t=b.ms,u={},v={},w={};if(f)for(y=0,z=cy.length;y<z;y++){var x=cy[y];if(x.el.id==d.id&&x.anim==b){x.percent!=e?(cy.splice(y,1),l=1):k=x,d.attr(x.totalOrigin);break}}else f=+v;for(var y=0,z=b.percents.length;y<z;y++){if(b.percents[y]==e||b.percents[y]>f*b.top){e=b.percents[y],p=b.percents[y-1]||0,t=t/b.top*(e-p),o=b.percents[y+1],j=b.anim[e];break}f&&d.attr(b.anim[b.percents[y]])}if(!!j){if(!k){for(var A in j)if(j[g](A))if(U[g](A)||d.paper.customAttributes[g](A)){u[A]=d.attr(A),u[A]==null&&(u[A]=T[A]),v[A]=j[A];switch(U[A]){case C:w[A]=(v[A]-u[A])/t;break;case"colour":u[A]=a.getRGB(u[A]);var B=a.getRGB(v[A]);w[A]={r:(B.r-u[A].r)/t,g:(B.g-u[A].g)/t,b:(B.b-u[A].b)/t};break;case"path":var D=bR(u[A],v[A]),E=D[1];u[A]=D[0],w[A]=[];for(y=0,z=u[A].length;y<z;y++){w[A][y]=[0];for(var F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(E[y][F]-u[A][y][F])/t}break;case"transform":var H=d._,I=ca(H[A],v[A]);if(I){u[A]=I.from,v[A]=I.to,w[A]=[],w[A].real=!0;for(y=0,z=u[A].length;y<z;y++){w[A][y]=[u[A][y][0]];for(F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(v[A][y][F]-u[A][y][F])/t}}else{var J=d.matrix||new cb,K={_:{transform:H.transform},getBBox:function(){return d.getBBox(1)}};u[A]=[J.a,J.b,J.c,J.d,J.e,J.f],b$(K,v[A]),v[A]=K._.transform,w[A]=[(K.matrix.a-J.a)/t,(K.matrix.b-J.b)/t,(K.matrix.c-J.c)/t,(K.matrix.d-J.d)/t,(K.matrix.e-J.e)/t,(K.matrix.f-J.f)/t]}break;case"csv":var L=r(j[A])[s](c),M=r(u[A])[s](c);if(A=="clip-rect"){u[A]=M,w[A]=[],y=M.length;while(y--)w[A][y]=(L[y]-u[A][y])/t}v[A]=L;break;default:L=[][n](j[A]),M=[][n](u[A]),w[A]=[],y=d.paper.customAttributes[A].length;while(y--)w[A][y]=((L[y]||0)-(M[y]||0))/t}}var O=j.easing,P=a.easing_formulas[O];if(!P){P=r(O).match(N);if(P&&P.length==5){var R=P;P=function(a){return cC(a,+R[1],+R[2],+R[3],+R[4],t)}}else P=bf}q=j.start||b.start||+(new Date),x={anim:b,percent:e,timestamp:q,start:q+(b.del||0),status:0,initstatus:f||0,stop:!1,ms:t,easing:P,from:u,diff:w,to:v,el:d,callback:j.callback,prev:p,next:o,repeat:i||b.times,origin:d.attr(),totalOrigin:h},cy.push(x);if(f&&!k&&!l){x.stop=!0,x.start=new Date-t*f;if(cy.length==1)return cA()}l&&(x.start=new Date-x.ms*f),cy.length==1&&cz(cA)}else k.initstatus=f,k.start=new Date-k.ms*f;eve("raphael.anim.start."+d.id,d,b)}}function cD(a,b){var c=[],d={};this.ms=b,this.times=1;if(a){for(var e in a)a[g](e)&&(d[Q(e)]=a[e],c.push(Q(e)));c.sort(bd)}this.anim=d,this.top=c[c.length-1],this.percents=c}function cC(a,b,c,d,e,f){function o(a,b){var c,d,e,f,j,k;for(e=a,k=0;k<8;k++){f=m(e)-a;if(z(f)<b)return e;j=(3*i*e+2*h)*e+g;if(z(j)<1e-6)break;e=e-f/j}c=0,d=1,e=a;if(e<c)return c;if(e>d)return d;while(c<d){f=m(e);if(z(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}function n(a,b){var c=o(a,b);return((l*c+k)*c+j)*c}function m(a){return((i*a+h)*a+g)*a}var g=3*b,h=3*(d-b)-g,i=1-g-h,j=3*c,k=3*(e-c)-j,l=1-j-k;return n(a,1/(200*f))}function cq(){return this.x+q+this.y+q+this.width+" × "+this.height}function cp(){return this.x+q+this.y}function cb(a,b,c,d,e,f){a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function bH(b,c,d){b=a._path2curve(b),c=a._path2curve(c);var e,f,g,h,i,j,k,l,m,n,o=d?0:[];for(var p=0,q=b.length;p<q;p++){var r=b[p];if(r[0]=="M")e=i=r[1],f=j=r[2];else{r[0]=="C"?(m=[e,f].concat(r.slice(1)),e=m[6],f=m[7]):(m=[e,f,e,f,i,j,i,j],e=i,f=j);for(var s=0,t=c.length;s<t;s++){var u=c[s];if(u[0]=="M")g=k=u[1],h=l=u[2];else{u[0]=="C"?(n=[g,h].concat(u.slice(1)),g=n[6],h=n[7]):(n=[g,h,g,h,k,l,k,l],g=k,h=l);var v=bG(m,n,d);if(d)o+=v;else{for(var w=0,x=v.length;w<x;w++)v[w].segment1=p,v[w].segment2=s,v[w].bez1=m,v[w].bez2=n;o=o.concat(v)}}}}}return o}function bG(b,c,d){var e=a.bezierBBox(b),f=a.bezierBBox(c);if(!a.isBBoxIntersect(e,f))return d?0:[];var g=bB.apply(0,b),h=bB.apply(0,c),i=~~(g/5),j=~~(h/5),k=[],l=[],m={},n=d?0:[];for(var o=0;o<i+1;o++){var p=a.findDotsAtSegment.apply(a,b.concat(o/i));k.push({x:p.x,y:p.y,t:o/i})}for(o=0;o<j+1;o++)p=a.findDotsAtSegment.apply(a,c.concat(o/j)),l.push({x:p.x,y:p.y,t:o/j});for(o=0;o<i;o++)for(var q=0;q<j;q++){var r=k[o],s=k[o+1],t=l[q],u=l[q+1],v=z(s.x-r.x)<.001?"y":"x",w=z(u.x-t.x)<.001?"y":"x",x=bD(r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y);if(x){if(m[x.x.toFixed(4)]==x.y.toFixed(4))continue;m[x.x.toFixed(4)]=x.y.toFixed(4);var y=r.t+z((x[v]-r[v])/(s[v]-r[v]))*(s.t-r.t),A=t.t+z((x[w]-t[w])/(u[w]-t[w]))*(u.t-t.t);y>=0&&y<=1&&A>=0&&A<=1&&(d?n++:n.push({x:x.x,y:x.y,t1:y,t2:A}))}}return n}function bF(a,b){return bG(a,b,1)}function bE(a,b){return bG(a,b)}function bD(a,b,c,d,e,f,g,h){if(!(x(a,c)<y(e,g)||y(a,c)>x(e,g)||x(b,d)<y(f,h)||y(b,d)>x(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(!k)return;var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(n<+y(a,c).toFixed(2)||n>+x(a,c).toFixed(2)||n<+y(e,g).toFixed(2)||n>+x(e,g).toFixed(2)||o<+y(b,d).toFixed(2)||o>+x(b,d).toFixed(2)||o<+y(f,h).toFixed(2)||o>+x(f,h).toFixed(2))return;return{x:l,y:m}}}function bC(a,b,c,d,e,f,g,h,i){if(!(i<0||bB(a,b,c,d,e,f,g,h)<i)){var j=1,k=j/2,l=j-k,m,n=.01;m=bB(a,b,c,d,e,f,g,h,l);while(z(m-i)>n)k/=2,l+=(m<i?1:-1)*k,m=bB(a,b,c,d,e,f,g,h,l);return l}}function bB(a,b,c,d,e,f,g,h,i){i==null&&(i=1),i=i>1?1:i<0?0:i;var j=i/2,k=12,l=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],m=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0;for(var o=0;o<k;o++){var p=j*l[o]+j,q=bA(p,a,c,e,g),r=bA(p,b,d,f,h),s=q*q+r*r;n+=m[o]*w.sqrt(s)}return j*n}function bA(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function by(a,b){var c=[];for(var d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function bx(){return this.hex}function bv(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];if(h[g](f)){bu(i,f);return c?c(h[f]):h[f]}i.length>=1e3&&delete h[i.shift()],i.push(f),h[f]=a[m](b,e);return c?c(h[f]):h[f]}return d}function bu(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function bm(a){if(Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[g](c)&&(b[c]=bm(a[c]));return b}function a(c){if(a.is(c,"function"))return b?c():eve.on("raphael.DOMload",c);if(a.is(c,E))return a._engine.create[m](a,c.splice(0,3+a.is(c[0],C))).add(c);var d=Array.prototype.slice.call(arguments,0);if(a.is(d[d.length-1],"function")){var e=d.pop();return b?e.call(a._engine.create[m](a,d)):eve.on("raphael.DOMload",function(){e.call(a._engine.create[m](a,d))})}return a._engine.create[m](a,arguments)}a.version="2.1.0",a.eve=eve;var b,c=/[, ]+/,d={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},e=/\{(\d+)\}/g,f="prototype",g="hasOwnProperty",h={doc:document,win:window},i={was:Object.prototype[g].call(h.win,"Raphael"),is:h.win.Raphael},j=function(){this.ca=this.customAttributes={}},k,l="appendChild",m="apply",n="concat",o="createTouch"in h.doc,p="",q=" ",r=String,s="split",t="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[s](q),u={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},v=r.prototype.toLowerCase,w=Math,x=w.max,y=w.min,z=w.abs,A=w.pow,B=w.PI,C="number",D="string",E="array",F="toString",G="fill",H=Object.prototype.toString,I={},J="push",K=a._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,L=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,M={NaN:1,Infinity:1,"-Infinity":1},N=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,O=w.round,P="setAttribute",Q=parseFloat,R=parseInt,S=r.prototype.toUpperCase,T=a._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},U=a._availableAnimAttrs={blur:C,"clip-rect":"csv",cx:C,cy:C,fill:"colour","fill-opacity":C,"font-size":C,height:C,opacity:C,path:"path",r:C,rx:C,ry:C,stroke:"colour","stroke-opacity":C,"stroke-width":C,transform:"transform",width:C,x:C,y:C},V=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,W=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,X={hs:1,rg:1},Y=/,?([achlmqrstvxz]),?/gi,Z=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,$=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,_=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,ba=a._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,bb={},bc=function(a,b){return a.key-b.key},bd=function(a,b){return Q(a)-Q(b)},be=function(){},bf=function(a){return a},bg=a._rectPath=function(a,b,c,d,e){if(e)return[["M",a+e,b],["l",c-e*2,0],["a",e,e,0,0,1,e,e],["l",0,d-e*2],["a",e,e,0,0,1,-e,e],["l",e*2-c,0],["a",e,e,0,0,1,-e,-e],["l",0,e*2-d],["a",e,e,0,0,1,e,-e],["z"]];return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},bh=function(a,b,c,d){d==null&&(d=c);return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},bi=a._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return bg(b.x,b.y,b.width,b.height)}},bj=a.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;a=bR(a);for(e=0,g=a.length;e<g;e++){i=a[e];for(f=1,h=i.length;f<h;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d}return a};a._g=h,a.type=h.win.SVGAngle||h.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(a.type=="VML"){var bk=h.doc.createElement("div"),bl;bk.innerHTML='<v:shape adj="1"/>',bl=bk.firstChild,bl.style.behavior="url(#default#VML)";if(!bl||typeof bl.adj!="object")return a.type=p;bk=null}a.svg=!(a.vml=a.type=="VML"),a._Paper=j,a.fn=k=j.prototype=a.prototype,a._id=0,a._oid=0,a.is=function(a,b){b=v.call(b);if(b=="finite")return!M[g](+a);if(b=="array")return a instanceof Array;return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||H.call(a).slice(8,-1).toLowerCase()==b},a.angle=function(b,c,d,e,f,g){if(f==null){var h=b-d,i=c-e;if(!h&&!i)return 0;return(180+w.atan2(-i,-h)*180/B+360)%360}return a.angle(b,c,f,g)-a.angle(d,e,f,g)},a.rad=function(a){return a%360*B/180},a.deg=function(a){return a*180/B%360},a.snapTo=function(b,c,d){d=a.is(d,"finite")?d:10;if(a.is(b,E)){var e=b.length;while(e--)if(z(b[e]-c)<=d)return b[e]}else{b=+b;var f=c%b;if(f<d)return c-f;if(f>b-d)return c-f+b}return c};var bn=a.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=w.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)});a.setWindow=function(b){eve("raphael.setWindow",a,h.win,b),h.win=b,h.doc=h.win.document,a._engine.initWin&&a._engine.initWin(h.win)};var bo=function(b){if(a.vml){var c=/^\s+|\s+$/g,d;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),d=e.body}catch(f){d=createPopup().document.body}var g=d.createTextRange();bo=bv(function(a){try{d.style.color=r(a).replace(c,p);var b=g.queryCommandValue("ForeColor");b=(b&255)<<16|b&65280|(b&16711680)>>>16;return"#"+("000000"+b.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=h.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",h.doc.body.appendChild(i),bo=bv(function(a){i.style.color=a;return h.doc.defaultView.getComputedStyle(i,p).getPropertyValue("color")})}return bo(b)},bp=function(){return"hsb("+[this.h,this.s,this.b]+")"},bq=function(){return"hsl("+[this.h,this.s,this.l]+")"},br=function(){return this.hex},bs=function(b,c,d){c==null&&a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b&&(d=b.b,c=b.g,b=b.r);if(c==null&&a.is(b,D)){var e=a.getRGB(b);b=e.r,c=e.g,d=e.b}if(b>1||c>1||d>1)b/=255,c/=255,d/=255;return[b,c,d]},bt=function(b,c,d,e){b*=255,c*=255,d*=255;var f={r:b,g:c,b:d,hex:a.rgb(b,c,d),toString:br};a.is(e,"finite")&&(f.opacity=e);return f};a.color=function(b){var c;a.is(b,"object")&&"h"in b&&"s"in b&&"b"in b?(c=a.hsb2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):a.is(b,"object")&&"h"in b&&"s"in b&&"l"in b?(c=a.hsl2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):(a.is(b,"string")&&(b=a.getRGB(b)),a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b?(c=a.rgb2hsl(b),b.h=c.h,b.s=c.s,b.l=c.l,c=a.rgb2hsb(b),b.v=c.b):(b={hex:"none"},b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1)),b.toString=br;return b},a.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;a=a%360/60,i=c*b,h=i*(1-z(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);if(a>1||b>1||c>1)a/=360,b/=100,c/=100;a*=360;var e,f,g,h,i;a=a%360/60,i=2*b*(c<.5?c:1-c),h=i*(1-z(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.rgb2hsb=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;f=x(a,b,c),g=f-y(a,b,c),d=g==0?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=g==0?0:g/f;return{h:d,s:e,b:f,toString:bp}},a.rgb2hsl=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;g=x(a,b,c),h=y(a,b,c),i=g-h,d=i==0?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=i==0?0:f<.5?i/(2*f):i/(2-2*f);return{h:d,s:e,l:f,toString:bq}},a._path2string=function(){return this.join(",").replace(Y,"$1")};var bw=a._preload=function(a,b){var c=h.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,h.doc.body.removeChild(this)},c.onerror=function(){h.doc.body.removeChild(this)},h.doc.body.appendChild(c),c.src=a};a.getRGB=bv(function(b){if(!b||!!((b=r(b)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx};if(b=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:bx};!X[g](b.toLowerCase().substring(0,2))&&b.charAt()!="#"&&(b=bo(b));var c,d,e,f,h,i,j,k=b.match(L);if(k){k[2]&&(f=R(k[2].substring(5),16),e=R(k[2].substring(3,5),16),d=R(k[2].substring(1,3),16)),k[3]&&(f=R((i=k[3].charAt(3))+i,16),e=R((i=k[3].charAt(2))+i,16),d=R((i=k[3].charAt(1))+i,16)),k[4]&&(j=k[4][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),k[1].toLowerCase().slice(0,4)=="rgba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100));if(k[5]){j=k[5][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsb2rgb(d,e,f,h)}if(k[6]){j=k[6][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsla"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsl2rgb(d,e,f,h)}k={r:d,g:e,b:f,toString:bx},k.hex="#"+(16777216|f|e<<8|d<<16).toString(16).slice(1),a.is(h,"finite")&&(k.opacity=h);return k}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx}},a),a.hsb=bv(function(b,c,d){return a.hsb2rgb(b,c,d).hex}),a.hsl=bv(function(b,c,d){return a.hsl2rgb(b,c,d).hex}),a.rgb=bv(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),a.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b}));return c.hex},a.getColor.reset=function(){delete this.start},a.parsePathString=function(b){if(!b)return null;var c=bz(b);if(c.arr)return bJ(c.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];a.is(b,E)&&a.is(b[0],E)&&(e=bJ(b)),e.length||r(b).replace(Z,function(a,b,c){var f=[],g=b.toLowerCase();c.replace(_,function(a,b){b&&f.push(+b)}),g=="m"&&f.length>2&&(e.push([b][n](f.splice(0,2))),g="l",b=b=="m"?"l":"L");if(g=="r")e.push([b][n](f));else while(f.length>=d[g]){e.push([b][n](f.splice(0,d[g])));if(!d[g])break}}),e.toString=a._path2string,c.arr=bJ(e);return e},a.parseTransformString=bv(function(b){if(!b)return null;var c={r:3,s:4,t:2,m:6},d=[];a.is(b,E)&&a.is(b[0],E)&&(d=bJ(b)),d.length||r(b).replace($,function(a,b,c){var e=[],f=v.call(b);c.replace(_,function(a,b){b&&e.push(+b)}),d.push([b][n](e))}),d.toString=a._path2string;return d});var bz=function(a){var b=bz.ps=bz.ps||{};b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[g](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])});return b[a]};a.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=A(j,3),l=A(j,2),m=i*i,n=m*i,o=k*a+l*3*i*c+j*3*i*i*e+n*g,p=k*b+l*3*i*d+j*3*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,x=j*e+i*g,y=j*f+i*h,z=90-w.atan2(q-s,r-t)*180/B;(q>s||r<t)&&(z+=180);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:x,y:y},alpha:z}},a.bezierBBox=function(b,c,d,e,f,g,h,i){a.is(b,"array")||(b=[b,c,d,e,f,g,h,i]);var j=bQ.apply(null,b);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},a.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},a.isBBoxIntersect=function(b,c){var d=a.isPointInsideBBox;return d(c,b.x,b.y)||d(c,b.x2,b.y)||d(c,b.x,b.y2)||d(c,b.x2,b.y2)||d(b,c.x,c.y)||d(b,c.x2,c.y)||d(b,c.x,c.y2)||d(b,c.x2,c.y2)||(b.x<c.x2&&b.x>c.x||c.x<b.x2&&c.x>b.x)&&(b.y<c.y2&&b.y>c.y||c.y<b.y2&&c.y>b.y)},a.pathIntersection=function(a,b){return bH(a,b)},a.pathIntersectionNumber=function(a,b){return bH(a,b,1)},a.isPointInsidePath=function(b,c,d){var e=a.pathBBox(b);return a.isPointInsideBBox(e,c,d)&&bH(b,[["M",c,d],["H",e.x2+10]],1)%2==1},a._removedFactory=function(a){return function(){eve("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var bI=a.pathBBox=function(a){var b=bz(a);if(b.bbox)return b.bbox;if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=bR(a);var c=0,d=0,e=[],f=[],g;for(var h=0,i=a.length;h<i;h++){g=a[h];if(g[0]=="M")c=g[1],d=g[2],e.push(c),f.push(d);else{var j=bQ(c,d,g[1],g[2],g[3],g[4],g[5],g[6]);e=e[n](j.min.x,j.max.x),f=f[n](j.min.y,j.max.y),c=g[5],d=g[6]}}var k=y[m](0,e),l=y[m](0,f),o=x[m](0,e),p=x[m](0,f),q={x:k,y:l,x2:o,y2:p,width:o-k,height:p-l};b.bbox=bm(q);return q},bJ=function(b){var c=bm(b);c.toString=a._path2string;return c},bK=a._pathToRelative=function(b){var c=bz(b);if(c.rel)return bJ(c.rel);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=b[0][1],f=b[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=b.length;j<k;j++){var l=d[j]=[],m=b[j];if(m[0]!=v.call(m[0])){l[0]=v.call(m[0]);switch(l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;n<o;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}}else{l=d[j]=[],m[0]=="m"&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;p<q;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}d.toString=a._path2string,c.rel=bJ(d);return d},bL=a._pathToAbsolute=function(b){var c=bz(b);if(c.abs)return bJ(c.abs);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);if(!b||!b.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=+b[0][1],f=+b[0][2],g=e,h=f,i++,d[0]=["M",e,f]);var j=b.length==3&&b[0][0]=="M"&&b[1][0].toUpperCase()=="R"&&b[2][0].toUpperCase()=="Z";for(var k,l,m=i,o=b.length;m<o;m++){d.push(k=[]),l=b[m];if(l[0]!=S.call(l[0])){k[0]=S.call(l[0]);switch(k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":var p=[e,f][n](l.slice(1));for(var q=2,r=p.length;q<r;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[n](by(p,j));break;case"M":g=+l[1]+e,h=+l[2]+f;default:for(q=1,r=l.length;q<r;q++)k[q]=+l[q]+(q%2?e:f)}}else if(l[0]=="R")p=[e,f][n](l.slice(1)),d.pop(),d=d[n](by(p,j)),k=["R"][n](l.slice(-2));else for(var s=0,t=l.length;s<t;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=h;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],h=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}d.toString=a._path2string,c.abs=bJ(d);return d},bM=function(a,b,c,d){return[a,b,c,d,c,d]},bN=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},bO=function(a,b,c,d,e,f,g,h,i,j){var k=B*120/180,l=B/180*(+e||0),m=[],o,p=bv(function(a,b,c){var d=a*w.cos(c)-b*w.sin(c),e=a*w.sin(c)+b*w.cos(c);return{x:d,y:e}});if(!j){o=p(a,b,-l),a=o.x,b=o.y,o=p(h,i,-l),h=o.x,i=o.y;var q=w.cos(B/180*e),r=w.sin(B/180*e),t=(a-h)/2,u=(b-i)/2,v=t*t/(c*c)+u*u/(d*d);v>1&&(v=w.sqrt(v),c=v*c,d=v*d);var x=c*c,y=d*d,A=(f==g?-1:1)*w.sqrt(z((x*y-x*u*u-y*t*t)/(x*u*u+y*t*t))),C=A*c*u/d+(a+h)/2,D=A*-d*t/c+(b+i)/2,E=w.asin(((b-D)/d).toFixed(9)),F=w.asin(((i-D)/d).toFixed(9));E=a<C?B-E:E,F=h<C?B-F:F,E<0&&(E=B*2+E),F<0&&(F=B*2+F),g&&E>F&&(E=E-B*2),!g&&F>E&&(F=F-B*2)}else E=j[0],F=j[1],C=j[2],D=j[3];var G=F-E;if(z(G)>k){var H=F,I=h,J=i;F=E+k*(g&&F>E?1:-1),h=C+c*w.cos(F),i=D+d*w.sin(F),m=bO(h,i,c,d,e,0,g,I,J,[F,H,C,D])}G=F-E;var K=w.cos(E),L=w.sin(E),M=w.cos(F),N=w.sin(F),O=w.tan(G/4),P=4/3*c*O,Q=4/3*d*O,R=[a,b],S=[a+P*L,b-Q*K],T=[h+P*N,i-Q*M],U=[h,i];S[0]=2*R[0]-S[0],S[1]=2*R[1]-S[1];if(j)return[S,T,U][n](m);m=[S,T,U][n](m).join()[s](",");var V=[];for(var W=0,X=m.length;W<X;W++)V[W]=W%2?p(m[W-1],m[W],l).y:p(m[W],m[W+1],l).x;return V},bP=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:A(j,3)*a+A(j,2)*3*i*c+j*3*i*i*e+A(i,3)*g,y:A(j,3)*b+A(j,2)*3*i*d+j*3*i*i*f+A(i,3)*h}},bQ=bv(function(a,b,c,d,e,f,g,h){var i=e-2*c+a-(g-2*e+c),j=2*(c-a)-2*(e-c),k=a-c,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,o=[b,h],p=[a,g],q;z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y)),i=f-2*d+b-(h-2*f+d),j=2*(d-b)-2*(f-d),k=b-d,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y));return{min:{x:y[m](0,p),y:y[m](0,o)},max:{x:x[m](0,p),y:x[m](0,o)}}}),bR=a._path2curve=bv(function(a,b){var c=!b&&bz(a);if(!b&&c.curve)return bJ(c.curve);var d=bL(a),e=b&&bL(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null);switch(a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][n](bO[m](0,[b.x,b.y][n](a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d][n](a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"][n](bN(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][n](bN(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][n](bM(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][n](bM(b.x,b.y,a[1],b.y));break;case"V":a=["C"][n](bM(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][n](bM(b.x,b.y,b.X,b.Y))}return a},i=function(a,b){if(a[b].length>7){a[b].shift();var c=a[b];while(c.length)a.splice(b++,0,["C"][n](c.splice(0,6)));a.splice(b,1),l=x(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&a[g][0]=="M"&&b[g][0]!="M"&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=x(d.length,e&&e.length||0))};for(var k=0,l=x(d.length,e&&e.length||0);k<l;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var o=d[k],p=e&&e[k],q=o.length,r=e&&p.length;f.x=o[q-2],f.y=o[q-1],f.bx=Q(o[q-4])||f.x,f.by=Q(o[q-3])||f.y,g.bx=e&&(Q(p[r-4])||g.x),g.by=e&&(Q(p[r-3])||g.y),g.x=e&&p[r-2],g.y=e&&p[r-1]}e||(c.curve=bJ(d));return e?[d,e]:d},null,bJ),bS=a._parseDots=bv(function(b){var c=[];for(var d=0,e=b.length;d<e;d++){var f={},g=b[d].match(/^([^:]*):?([\d\.]*)/);f.color=a.getRGB(g[1]);if(f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),c.push(f)}for(d=1,e=c.length-1;d<e;d++)if(!c[d].offset){var h=Q(c[d-1].offset||0),i=0;for(var j=d+1;j<e;j++)if(c[j].offset){i=c[j].offset;break}i||(i=100,j=e),i=Q(i);var k=(i-h)/(j-d+1);for(;d<j;d++)h+=k,c[d].offset=h+"%"}return c}),bT=a._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)},bU=a._tofront=function(a,b){b.top!==a&&(bT(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},bV=a._toback=function(a,b){b.bottom!==a&&(bT(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},bW=a._insertafter=function(a,b,c){bT(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},bX=a._insertbefore=function(a,b,c){bT(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},bY=a.toMatrix=function(a,b){var c=bI(a),d={_:{transform:p},getBBox:function(){return c}};b$(d,b);return d.matrix},bZ=a.transformPath=function(a,b){return bj(a,bY(a,b))},b$=a._extractTransform=function(b,c){if(c==null)return b._.transform;c=r(c).replace(/\.{3}|\u2026/g,b._.transform||p);var d=a.parseTransformString(c),e=0,f=0,g=0,h=1,i=1,j=b._,k=new cb;j.transform=d||[];if(d)for(var l=0,m=d.length;l<m;l++){var n=d[l],o=n.length,q=r(n[0]).toLowerCase(),s=n[0]!=q,t=s?k.invert():0,u,v,w,x,y;q=="t"&&o==3?s?(u=t.x(0,0),v=t.y(0,0),w=t.x(n[1],n[2]),x=t.y(n[1],n[2]),k.translate(w-u,x-v)):k.translate(n[1],n[2]):q=="r"?o==2?(y=y||b.getBBox(1),k.rotate(n[1],y.x+y.width/2,y.y+y.height/2),e+=n[1]):o==4&&(s?(w=t.x(n[2],n[3]),x=t.y(n[2],n[3]),k.rotate(n[1],w,x)):k.rotate(n[1],n[2],n[3]),e+=n[1]):q=="s"?o==2||o==3?(y=y||b.getBBox(1),k.scale(n[1],n[o-1],y.x+y.width/2,y.y+y.height/2),h*=n[1],i*=n[o-1]):o==5&&(s?(w=t.x(n[3],n[4]),x=t.y(n[3],n[4]),k.scale(n[1],n[2],w,x)):k.scale(n[1],n[2],n[3],n[4]),h*=n[1],i*=n[2]):q=="m"&&o==7&&k.add(n[1],n[2],n[3],n[4],n[5],n[6]),j.dirtyT=1,b.matrix=k}b.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,h==1&&i==1&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1},b_=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return a.length==4?[b,0,a[2],a[3]]:[b,0];case"s":return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]}},ca=a._equaliseTransform=function(b,c){c=r(c).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],c=a.parseTransformString(c)||[];var d=x(b.length,c.length),e=[],f=[],g=0,h,i,j,k;for(;g<d;g++){j=b[g]||b_(c[g]),k=c[g]||b_(j);if(j[0]!=k[0]||j[0].toLowerCase()=="r"&&(j[2]!=k[2]||j[3]!=k[3])||j[0].toLowerCase()=="s"&&(j[3]!=k[3]||j[4]!=k[4]))return;e[g]=[],f[g]=[];for(h=0,i=x(j.length,k.length);h<i;h++)h in j&&(e[g][h]=j[h]),h in k&&(f[g][h]=k[h])}return{from:e,to:f}};a._getContainer=function(b,c,d,e){var f;f=e==null&&!a.is(b,"object")?h.doc.getElementById(b):b;if(f!=null){if(f.tagName)return c==null?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:c,height:d};return{container:1,x:b,y:c,width:d,height:e}}},a.pathToRelative=bK,a._engine={},a.path2curve=bR,a.matrix=function(a,b,c,d,e,f){return new cb(a,b,c,d,e,f)},function(b){function d(a){var b=w.sqrt(c(a));a[0]&&(a[0]/=b),a[1]&&(a[1]/=b)}function c(a){return a[0]*a[0]+a[1]*a[1]}b.add=function(a,b,c,d,e,f){var g=[[],[],[]],h=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],i=[[a,c,e],[b,d,f],[0,0,1]],j,k,l,m;a&&a instanceof cb&&(i=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]);for(j=0;j<3;j++)for(k=0;k<3;k++){m=0;for(l=0;l<3;l++)m+=h[j][l]*i[l][k];g[j][k]=m}this.a=g[0][0],this.b=g[1][0],this.c=g[0][1],this.d=g[1][1],this.e=g[0][2],this.f=g[1][2]},b.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new cb(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},b.clone=function(){return new cb(this.a,this.b,this.c,this.d,this.e,this.f)},b.translate=function(a,b){this.add(1,0,0,1,a,b)},b.scale=function(a,b,c,d){b==null&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},b.rotate=function(b,c,d){b=a.rad(b),c=c||0,d=d||0;var e=+w.cos(b).toFixed(9),f=+w.sin(b).toFixed(9);this.add(e,f,-f,e,c,d),this.add(1,0,0,1,-c,-d)},b.x=function(a,b){return a*this.a+b*this.c+this.e},b.y=function(a,b){return a*this.b+b*this.d+this.f},b.get=function(a){return+this[r.fromCharCode(97+a)].toFixed(4)},b.toString=function(){return a.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},b.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},b.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},b.split=function(){var b={};b.dx=this.e,b.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];b.scalex=w.sqrt(c(e[0])),d(e[0]),b.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*b.shear,e[1][1]-e[0][1]*b.shear],b.scaley=w.sqrt(c(e[1])),d(e[1]),b.shear/=b.scaley;var f=-e[0][1],g=e[1][1];g<0?(b.rotate=a.deg(w.acos(g)),f<0&&(b.rotate=360-b.rotate)):b.rotate=a.deg(w.asin(f)),b.isSimple=!+b.shear.toFixed(9)&&(b.scalex.toFixed(9)==b.scaley.toFixed(9)||!b.rotate),b.isSuperSimple=!+b.shear.toFixed(9)&&b.scalex.toFixed(9)==b.scaley.toFixed(9)&&!b.rotate,b.noRotation=!+b.shear.toFixed(9)&&!b.rotate;return b},b.toTransformString=function(a){var b=a||this[s]();if(b.isSimple){b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4);return(b.dx||b.dy?"t"+[b.dx,b.dy]:p)+(b.scalex!=1||b.scaley!=1?"s"+[b.scalex,b.scaley,0,0]:p)+(b.rotate?"r"+[b.rotate,0,0]:p)}return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(cb.prototype);var cc=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(cc&&cc[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&cc&&cc[1]<8?k.safari=function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:k.safari=be;var cd=function(){this.returnValue=!1},ce=function(){return this.originalEvent.preventDefault()},cf=function(){this.cancelBubble=!0},cg=function(){return this.originalEvent.stopPropagation()},ch=function(){if(h.doc.addEventListener)return function(a,b,c,d){var e=o&&u[b]?u[b]:b,f=function(e){var f=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,i=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,j=e.clientX+i,k=e.clientY+f;if(o&&u[g](b))for(var l=0,m=e.targetTouches&&e.targetTouches.length;l<m;l++)if(e.targetTouches[l].target==a){var n=e;e=e.targetTouches[l],e.originalEvent=n,e.preventDefault=ce,e.stopPropagation=cg;break}return c.call(d,e,j,k)};a.addEventListener(e,f,!1);return function(){a.removeEventListener(e,f,!1);return!0}};if(h.doc.attachEvent)return function(a,b,c,d){var e=function(a){a=a||h.win.event;var b=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;a.preventDefault=a.preventDefault||cd,a.stopPropagation=a.stopPropagation||cf;return c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){a.detachEvent("on"+b,e);return!0};return f}}(),ci=[],cj=function(a){var b=a.clientX,c=a.clientY,d=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f,g=ci.length;while(g--){f=ci[g];if(o){var i=a.touches.length,j;while(i--){j=a.touches[i];if(j.identifier==f.el._drag.id){b=j.clientX,c=j.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}}else a.preventDefault();var k=f.el.node,l,m=k.nextSibling,n=k.parentNode,p=k.style.display;h.win.opera&&n.removeChild(k),k.style.display="none",l=f.el.paper.getElementByPoint(b,c),k.style.display=p,h.win.opera&&(m?n.insertBefore(k,m):n.appendChild(k)),l&&eve("raphael.drag.over."+f.el.id,f.el,l),b+=e,c+=d,eve("raphael.drag.move."+f.el.id,f.move_scope||f.el,b-f.el._drag.x,c-f.el._drag.y,b,c,a)}},ck=function(b){a.unmousemove(cj).unmouseup(ck);var c=ci.length,d;while(c--)d=ci[c],d.el._drag={},eve("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,b);ci=[]},cl=a.el={};for(var cm=t.length;cm--;)(function(b){a[b]=cl[b]=function(c,d){a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:ch(this.shape||this.node||h.doc,b,c,d||this)}));return this},a["un"+b]=cl["un"+b]=function(a){var c=this.events||[],d=c.length;while(d--)if(c[d].name==b&&c[d].f==a){c[d].unbind(),c.splice(d,1),!c.length&&delete this.events;return this}return this}})(t[cm]);cl.data=function(b,c){var d=bb[this.id]=bb[this.id]||{};if(arguments.length==1){if(a.is(b,"object")){for(var e in b)b[g](e)&&this.data(e,b[e]);return this}eve("raphael.data.get."+this.id,this,d[b],b);return d[b]}d[b]=c,eve("raphael.data.set."+this.id,this,c,b);return this},cl.removeData=function(a){a==null?bb[this.id]={}:bb[this.id]&&delete bb[this.id][a];return this},cl.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},cl.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var cn=[];cl.drag=function(b,c,d,e,f,g){function i(i){(i.originalEvent||i).preventDefault();var j=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,k=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft;this._drag.x=i.clientX+k,this._drag.y=i.clientY+j,this._drag.id=i.identifier,!ci.length&&a.mousemove(cj).mouseup(ck),ci.push({el:this,move_scope:e,start_scope:f,end_scope:g}),c&&eve.on("raphael.drag.start."+this.id,c),b&&eve.on("raphael.drag.move."+this.id,b),d&&eve.on("raphael.drag.end."+this.id,d),eve("raphael.drag.start."+this.id,f||e||this,i.clientX+k,i.clientY+j,i)}this._drag={},cn.push({el:this,start:i}),this.mousedown(i);return this},cl.onDragOver=function(a){a?eve.on("raphael.drag.over."+this.id,a):eve.unbind("raphael.drag.over."+this.id)},cl.undrag=function(){var b=cn.length;while(b--)cn[b].el==this&&(this.unmousedown(cn[b].start),cn.splice(b,1),eve.unbind("raphael.drag.*."+this.id));!cn.length&&a.unmousemove(cj).unmouseup(ck)},k.circle=function(b,c,d){var e=a._engine.circle(this,b||0,c||0,d||0);this.__set__&&this.__set__.push(e);return e},k.rect=function(b,c,d,e,f){var g=a._engine.rect(this,b||0,c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.ellipse=function(b,c,d,e){var f=a._engine.ellipse(this,b||0,c||0,d||0,e||0);this.__set__&&this.__set__.push(f);return f},k.path=function(b){b&&!a.is(b,D)&&!a.is(b[0],E)&&(b+=p);var c=a._engine.path(a.format[m](a,arguments),this);this.__set__&&this.__set__.push(c);return c},k.image=function(b,c,d,e,f){var g=a._engine.image(this,b||"about:blank",c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.text=function(b,c,d){var e=a._engine.text(this,b||0,c||0,r(d));this.__set__&&this.__set__.push(e);return e},k.set=function(b){!a.is(b,"array")&&(b=Array.prototype.splice.call(arguments,0,arguments.length));var c=new cG(b);this.__set__&&this.__set__.push(c);return c},k.setStart=function(a){this.__set__=a||this.set()},k.setFinish=function(a){var b=this.__set__;delete this.__set__;return b},k.setSize=function(b,c){return a._engine.setSize.call(this,b,c)},k.setViewBox=function(b,c,d,e,f){return a._engine.setViewBox.call(this,b,c,d,e,f)},k.top=k.bottom=null,k.raphael=a;var co=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,i=b.top+(h.win.pageYOffset||e.scrollTop||d.scrollTop)-f,j=b.left+(h.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:i,x:j}};k.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=h.doc.elementFromPoint(a,b);if(h.win.opera&&e.tagName=="svg"){var f=co(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var i=d.getIntersectionList(g,null);i.length&&(e=i[i.length-1])}if(!e)return null;while(e.parentNode&&e!=d.parentNode&&!e.raphael)e=e.parentNode;e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null;return e},k.getById=function(a){var b=this.bottom;while(b){if(b.id==a)return b;b=b.next}return null},k.forEach=function(a,b){var c=this.bottom;while(c){if(a.call(b,c)===!1)return this;c=c.next}return this},k.getElementsByPoint=function(a,b){var c=this.set();this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)});return c},cl.isPointInside=function(b,c){var d=this.realPath=this.realPath||bi[this.type](this);return a.isPointInsidePath(d,b,c)},cl.getBBox=function(a){if(this.removed)return{};var b=this._;if(a){if(b.dirty||!b.bboxwt)this.realPath=bi[this.type](this),b.bboxwt=bI(this.realPath),b.bboxwt.toString=cq,b.dirty=0;return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath)b.bboxwt=0,this.realPath=bi[this.type](this);b.bbox=bI(bj(this.realPath,this.matrix)),b.bbox.toString=cq,b.dirty=b.dirtyT=0}return b.bbox},cl.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(a);return a},cl.glow=function(a){if(this.type=="text")return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||bi[this.type](this);f=this.matrix?bj(f,this.matrix):f;for(var g=1;g<c+1;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cr={},cs=function(b,c,d,e,f,g,h,i,j){return j==null?bB(b,c,d,e,f,g,h,i):a.findDotsAtSegment(b,c,d,e,f,g,h,i,bC(b,c,d,e,f,g,h,i,j))},ct=function(b,c){return function(d,e,f){d=bR(d);var g,h,i,j,k="",l={},m,n=0;for(var o=0,p=d.length;o<p;o++){i=d[o];if(i[0]=="M")g=+i[1],h=+i[2];else{j=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6]);if(n+j>e){if(c&&!l.start){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),k+=["C"+m.start.x,m.start.y,m.m.x,m.m.y,m.x,m.y];if(f)return k;l.start=k,k=["M"+m.x,m.y+"C"+m.n.x,m.n.y,m.end.x,m.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!b&&!c){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n);return{x:m.x,y:m.y,alpha:m.alpha}}}n+=j,g=+i[5],h=+i[6]}k+=i.shift()+i}l.end=k,m=b?n:c?l:a.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),m.alpha&&(m={x:m.x,y:m.y,alpha:m.alpha});return m}},cu=ct(1),cv=ct(),cw=ct(0,1);a.getTotalLength=cu,a.getPointAtLength=cv,a.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return cw(a,b).end;var d=cw(a,c,1);return b?cw(d,b).end:d},cl.getTotalLength=function(){if(this.type=="path"){if(this.node.getTotalLength)return this.node.getTotalLength();return cu(this.attrs.path)}},cl.getPointAtLength=function(a){if(this.type=="path")return cv(this.attrs.path,a)},cl.getSubpath=function(b,c){if(this.type=="path")return a.getSubpath(this.attrs.path,b,c)};var cx=a.easing_formulas={linear:function(a){return a},"<":function(a){return A(a,1.7)},">":function(a){return A(a,.48)},"<>":function(a){var b=.48-a/1.04,c=w.sqrt(.1734+b*b),d=c-b,e=A(z(d),1/3)*(d<0?-1:1),f=-c-b,g=A(z(f),1/3)*(f<0?-1:1),h=e+g+.5;return(1-h)*3*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a=a-1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){if(a==!!a)return a;return A(2,-10*a)*w.sin((a-.075)*2*B/.3)+1},bounce:function(a){var b=7.5625,c=2.75,d;a<1/c?d=b*a*a:a<2/c?(a-=1.5/c,d=b*a*a+.75):a<2.5/c?(a-=2.25/c,d=b*a*a+.9375):(a-=2.625/c,d=b*a*a+.984375);return d}};cx.easeIn=cx["ease-in"]=cx["<"],cx.easeOut=cx["ease-out"]=cx[">"],cx.easeInOut=cx["ease-in-out"]=cx["<>"],cx["back-in"]=cx.backIn,cx["back-out"]=cx.backOut;var cy=[],cz=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,16)},cA=function(){var b=+(new Date),c=0;for(;c<cy.length;c++){var d=cy[c];if(d.el.removed||d.paused)continue;var e=b-d.start,f=d.ms,h=d.easing,i=d.from,j=d.diff,k=d.to,l=d.t,m=d.el,o={},p,r={},s;d.initstatus?(e=(d.initstatus*d.anim.top-d.prev)/(d.percent-d.prev)*f,d.status=d.initstatus,delete d.initstatus,d.stop&&cy.splice(c--,1)):d.status=(d.prev+(d.percent-d.prev)*(e/f))/d.anim.top;if(e<0)continue;if(e<f){var t=h(e/f);for(var u in i)if(i[g](u)){switch(U[u]){case C:p=+i[u]+t*f*j[u];break;case"colour":p="rgb("+[cB(O(i[u].r+t*f*j[u].r)),cB(O(i[u].g+t*f*j[u].g)),cB(O(i[u].b+t*f*j[u].b))].join(",")+")";break;case"path":p=[];for(var v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(var x=1,y=i[u][v].length;x<y;x++)p[v][x]=+i[u][v][x]+t*f*j[u][v][x];p[v]=p[v].join(q)}p=p.join(q);break;case"transform":if(j[u].real){p=[];for(v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(x=1,y=i[u][v].length;x<y;x++)p[v][x]=i[u][v][x]+t*f*j[u][v][x]}}else{var z=function(a){return+i[u][a]+t*f*j[u][a]};p=[["m",z(0),z(1),z(2),z(3),z(4),z(5)]]}break;case"csv":if(u=="clip-rect"){p=[],v=4;while(v--)p[v]=+i[u][v]+t*f*j[u][v]}break;default:var A=[][n](i[u]);p=[],v=m.paper.customAttributes[u].length;while(v--)p[v]=+A[v]+t*f*j[u][v]}o[u]=p}m.attr(o),function(a,b,c){setTimeout(function(){eve("raphael.anim.frame."+a,b,c)})}(m.id,m,d.anim)}else{(function(b,c,d){setTimeout(function(){eve("raphael.anim.frame."+c.id,c,d),eve("raphael.anim.finish."+c.id,c,d),a.is(b,"function")&&b.call(c)})})(d.callback,m,d.anim),m.attr(k),cy.splice(c--,1);if(d.repeat>1&&!d.next){for(s in k)k[g](s)&&(r[s]=d.totalOrigin[s]);d.el.attr(r),cE(d.anim,d.el,d.anim.percents[0],null,d.totalOrigin,d.repeat-1)}d.next&&!d.stop&&cE(d.anim,d.el,d.next,null,d.totalOrigin,d.repeat)}}a.svg&&m&&m.paper&&m.paper.safari(),cy.length&&cz(cA)},cB=function(a){return a>255?255:a<0?0:a};cl.animateWith=function(b,c,d,e,f,g){var h=this;if(h.removed){g&&g.call(h);return h}var i=d instanceof cD?d:a.animation(d,e,f,g),j,k;cE(i,h,i.percents[0],null,h.attr());for(var l=0,m=cy.length;l<m;l++)if(cy[l].anim==c&&cy[l].el==b){cy[m-1].start=cy[l].start;break}return h},cl.onAnimation=function(a){a?eve.on("raphael.anim.frame."+this.id,a):eve.unbind("raphael.anim.frame."+this.id);return this},cD.prototype.delay=function(a){var b=new cD(this.anim,this.ms);b.times=this.times,b.del=+a||0;return b},cD.prototype.repeat=function(a){var b=new cD(this.anim,this.ms);b.del=this.del,b.times=w.floor(x(a,0))||1;return b},a.animation=function(b,c,d,e){if(b instanceof cD)return b;if(a.is(d,"function")||!d)e=e||d||null,d=null;b=Object(b),c=+c||0;var f={},h,i;for(i in b)b[g](i)&&Q(i)!=i&&Q(i)+"%"!=i&&(h=!0,f[i]=b[i]);if(!h)return new cD(b,c);d&&(f.easing=d),e&&(f.callback=e);return new cD({100:f},c)},cl.animate=function(b,c,d,e){var f=this;if(f.removed){e&&e.call(f);return f}var g=b instanceof cD?b:a.animation(b,c,d,e);cE(g,f,g.percents[0],null,f.attr());return f},cl.setTime=function(a,b){a&&b!=null&&this.status(a,y(b,a.ms)/a.ms);return this},cl.status=function(a,b){var c=[],d=0,e,f;if(b!=null){cE(a,this,-1,y(b,1));return this}e=cy.length;for(;d<e;d++){f=cy[d];if(f.el.id==this.id&&(!a||f.anim==a)){if(a)return f.status;c.push({anim:f.anim,status:f.status})}}if(a)return 0;return c},cl.pause=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.pause."+this.id,this,cy[b].anim)!==!1&&(cy[b].paused=!0);return this},cl.resume=function(a){for(var b=0;b<cy.length;b++)if(cy[b].el.id==this.id&&(!a||cy[b].anim==a)){var c=cy[b];eve("raphael.anim.resume."+this.id,this,c.anim)!==!1&&(delete c.paused,this.status(c.anim,c.status))}return this},cl.stop=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.stop."+this.id,this,cy[b].anim)!==!1&&cy.splice(b--,1);return this},eve.on("raphael.remove",cF),eve.on("raphael.clear",cF),cl.toString=function(){return"Raphaël’s object"};var cG=function(a){this.items=[],this.length=0,this.type="set";if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==cl.constructor||a[b].constructor==cG)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},cH=cG.prototype;cH.push=function(){var a,b;for(var c=0,d=arguments.length;c<d;c++)a=arguments[c],a&&(a.constructor==cl.constructor||a.constructor==cG)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},cH.pop=function(){this.length&&delete this[this.length--];return this.items.pop()},cH.forEach=function(a,b){for(var c=0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var cI in cl)cl[g](cI)&&(cH[cI]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][m](c,b)})}}(cI));cH.attr=function(b,c){if(b&&a.is(b,E)&&a.is(b[0],"object"))for(var d=0,e=b.length;d<e;d++)this.items[d].attr(b[d]);else for(var f=0,g=this.items.length;f<g;f++)this.items[f].attr(b,c);return this},cH.clear=function(){while(this.length)this.pop()},cH.splice=function(a,b,c){a=a<0?x(this.length+a,0):a,b=x(0,y(this.length-a,b));var d=[],e=[],f=[],g;for(g=2;g<arguments.length;g++)f.push(arguments[g]);for(g=0;g<b;g++)e.push(this[a+g]);for(;g<this.length-a;g++)d.push(this[a+g]);var h=f.length;for(g=0;g<h+d.length;g++)this.items[a+g]=this[a+g]=g<h?f[g]:d[g-h];g=this.items.length=this.length-=b-h;while(this[g])delete this[g++];return new cG(e)},cH.exclude=function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]==a){this.splice(b,1);return!0}},cH.animate=function(b,c,d,e){(a.is(d,"function")||!d)&&(e=d||null);var f=this.items.length,g=f,h,i=this,j;if(!f)return this;e&&(j=function(){!--f&&e.call(i)}),d=a.is(d,D)?d:j;var k=a.animation(b,c,d,j);h=this.items[--g].animate(k);while(g--)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(h,k,k);return this},cH.insertAfter=function(a){var b=this.items.length;while(b--)this.items[b].insertAfter(a);return this},cH.getBBox=function(){var a=[],b=[],c=[],d=[];for(var e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}a=y[m](0,a),b=y[m](0,b),c=x[m](0,c),d=x[m](0,d);return{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},cH.clone=function(a){a=new cG;for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());return a},cH.toString=function(){return"Raphaël‘s set"},a.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[g](d)&&(b.face[d]=a.face[d]);this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b];if(!a.svg){b.face["units-per-em"]=R(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[g](e)){var f=a.glyphs[e];b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"};if(f.k)for(var h in f.k)f[g](h)&&(b.glyphs[e].k[h]=f.k[h])}}return a},k.getFont=function(b,c,d,e){e=e||"normal",d=d||"normal",c=+c||{normal:400,bold:700,lighter:300,bolder:800}[c]||400;if(!!a.fonts){var f=a.fonts[b];if(!f){var h=new RegExp("(^|\\s)"+b.replace(/[^\w\d\s+!~.:_-]/g,p)+"(\\s|$)","i");for(var i in a.fonts)if(a.fonts[g](i)&&h.test(i)){f=a.fonts[i];break}}var j;if(f)for(var k=0,l=f.length;k<l;k++){j=f[k];if(j.face["font-weight"]==c&&(j.face["font-style"]==d||!j.face["font-style"])&&j.face["font-stretch"]==e)break}return j}},k.print=function(b,d,e,f,g,h,i){h=h||"middle",i=x(y(i||0,1),-1);var j=r(e)[s](p),k=0,l=0,m=p,n;a.is(f,e)&&(f=this.getFont(f));if(f){n=(g||16)/f.face["units-per-em"];var o=f.face.bbox[s](c),q=+o[0],t=o[3]-o[1],u=0,v=+o[1]+(h=="baseline"?t+ +f.face.descent:t/2);for(var w=0,z=j.length;w<z;w++){if(j[w]=="\n")k=0,B=0,l=0,u+=t;else{var A=l&&f.glyphs[j[w-1]]||{},B=f.glyphs[j[w]];k+=l?(A.w||f.w)+(A.k&&A.k[j[w]]||0)+f.w*i:0,l=1}B&&B.d&&(m+=a.transformPath(B.d,["t",k*n,u*n,"s",n,n,q,v,"t",(b-q)/n,(d-v)/n]))}}return this.path(m).attr({fill:"#000",stroke:"none"})},k.add=function(b){if(a.is(b,"array")){var c=this.set(),e=0,f=b.length,h;for(;e<f;e++)h=b[e]||{},d[g](h.type)&&c.push(this[h.type]().attr(h))}return c},a.format=function(b,c){var d=a.is(c,E)?[0][n](c):arguments;b&&a.is(b,D)&&d.length-1&&(b=b.replace(e,function(a,b){return d[++b]==null?p:d[b]}));return b||p},a.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),typeof e=="function"&&f&&(e=e()))}),e=(e==null||e==d?a:e)+"";return e};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),a.ninja=function(){i.was?h.win.Raphael=i.is:delete Raphael;return a},a.st=cH,function(b,c,d){function e(){/in/.test(b.readyState)?setTimeout(e,9):a.eve("raphael.DOMload")}b.readyState==null&&b.addEventListener&&(b.addEventListener(c,d=function(){b.removeEventListener(c,d,!1),b.readyState="complete"},!1),b.readyState="loading"),e()}(document,"DOMContentLoaded"),i.was?h.win.Raphael=a:Raphael=a,eve.on("raphael.DOMload",function(){b=!0})}(),window.Raphael.svg&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=a.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};a.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){typeof d=="string"&&(d=q(d));for(var f in e)e[b](f)&&(f.substring(0,6)=="xlink:"?d.setAttributeNS(n,f.substring(6),c(e[f])):d.setAttribute(f,c(e[f])))}else d=a._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(b,e){var j="linear",k=b.id+e,m=.5,n=.5,o=b.node,p=b.paper,r=o.style,s=a._g.doc.getElementById(k);if(!s){e=c(e).replace(a._radial_gradient,function(a,b,c){j="radial";if(b&&c){m=d(b),n=d(c);var e=(n>.5)*2-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&n!=.5&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/);if(j=="linear"){var t=e.shift();t=-d(t);if(isNaN(t))return null;var u=[0,0,f.cos(a.rad(t)),f.sin(a.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=a._parseDots(e);if(!w)return null;k=k.replace(/[\(\)\s,\xb0#]/g,"_"),b.gradient&&k!=b.gradient.id&&(p.defs.removeChild(b.gradient),delete b.gradient);if(!b.gradient){s=q(j+"Gradient",{id:k}),b.gradient=s,q(s,j=="radial"?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:b.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;x<y;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1;return 1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if(d.type=="path"){var g=c(e).toLowerCase().split("-"),h=d.paper,i=f?"end":"start",j=d.node,k=d.attrs,m=k["stroke-width"],n=g.length,r="classic",s,t,u,v,w,x=3,y=3,z=5;while(n--)switch(g[n]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":r=g[n];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}r=="open"?(x+=2,y+=2,z+=2,u=1,v=f?4:1,w={fill:"none",stroke:k.stroke}):(v=u=x/2,w={fill:k.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={};if(r!="none"){var A="raphael-marker-"+r,B="raphael-marker-"+i+r+x+y;a._g.doc.getElementById(A)?p[A]++:(h.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[r],id:A})),p[A]=1);var C=a._g.doc.getElementById(B),D;C?(p[B]++,D=C.getElementsByTagName("use")[0]):(C=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:v,refY:y/2}),D=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),C.appendChild(D),h.defs.appendChild(C),p[B]=1),q(D,w);var F=u*(r!="diamond"&&r!="oval");f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-F*m):(s=F*m,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),w={},w["marker-"+i]="url(#"+B+")";if(t||s)w.d=Raphael.getSubpath(k.path,s,t);q(j,w),d._.arrows[i+"Path"]=A,d._.arrows[i+"Marker"]=B,d._.arrows[i+"dx"]=F,d._.arrows[i+"Type"]=r,d._.arrows[i+"String"]=e}else f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-s):(s=0,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),d._.arrows[i+"Path"]&&q(j,{d:Raphael.getSubpath(k.path,s,t)}),delete d._.arrows[i+"Path"],delete d._.arrows[i+"Marker"],delete d._.arrows[i+"dx"],delete d._.arrows[i+"Type"],delete d._.arrows[i+"String"];for(w in p)if(p[b](w)&&!p[w]){var G=a._g.doc.getElementById(w);G&&G.parentNode.removeChild(G)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,b,d){b=u[c(b).toLowerCase()];if(b){var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=b.length;while(h--)g[h]=b[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[b](o)){if(!a._availableAttrs[b](o))continue;var p=f[o];k[o]=p;switch(o){case"blur":d.blur(p);break;case"href":case"title":case"target":var u=i.parentNode;if(u.tagName.toLowerCase()!="a"){var w=q("a");u.insertBefore(w,i),w.appendChild(i),u=w}o=="target"?u.setAttributeNS(n,"show",p=="blank"?"new":p):u.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var x=c(p).split(j);if(x.length==4){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var z=q("clipPath"),A=q("rect");z.id=a.createUUID(),q(A,{x:x[0],y:x[1],width:x[2],height:x[3]}),z.appendChild(A),d.paper.defs.appendChild(z),q(i,{"clip-path":"url(#"+z.id+")"}),d.clip=A}if(!p){var B=i.getAttribute("clip-path");if(B){var C=a._g.doc.getElementById(B.replace(/(^url\(#|\)$)/g,l));C&&C.parentNode.removeChild(C),q(i,{"clip-path":l}),delete d.clip}}break;case"path":d.type=="path"&&(q(i,{d:p?k.path=a._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":i.setAttribute(o,p),d._.dirty=1;if(k.fx)o="x",p=k.x;else break;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if(o=="rx"&&d.type=="rect")break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":i.setAttribute(o,p),d._.dirty=1;if(k.fy)o="y",p=k.y;else break;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if(o=="ry"&&d.type=="rect")break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":d.type=="rect"?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":d.type=="image"&&i.setAttributeNS(n,"href",p);break;case"stroke-width":if(d._.sx!=1||d._.sy!=1)p/=g(h(d._.sx),h(d._.sy))||1;d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var D=c(p).match(a._ISURL);if(D){z=q("pattern");var F=q("image");z.id=a.createUUID(),q(z,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":D[1]}),z.appendChild(F),function(b){a._preload(D[1],function(){var a=this.offsetWidth,c=this.offsetHeight;q(b,{width:a,height:c}),q(F,{width:a,height:c}),d.paper.safari()})}(z),d.paper.defs.appendChild(z),q(i,{fill:"url(#"+z.id+")"}),d.pattern=z,d.pattern&&s(d);break}var G=a.getRGB(p);if(!G.error)delete f.gradient,delete k.gradient,!a.is(k.opacity,"undefined")&&a.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!a.is(k["fill-opacity"],"undefined")&&a.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});else if((d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}G[b]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=a.getRGB(p),i.setAttribute(o,G.hex),o=="stroke"&&G[b]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),o=="stroke"&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":(d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p);break;case"opacity":k.gradient&&!k[b]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break};default:o=="font-size"&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if(d.type=="text"&&!!(f[b]("text")||f[b]("font")||f[b]("font-size")||f[b]("x")||f[b]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(a._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;if(f[b]("text")){g.text=f.text;while(h.firstChild)h.removeChild(h.firstChild);var j=c(f.text).split("\n"),k=[],m;for(var n=0,o=j.length;n<o;n++)m=q("tspan"),n&&q(m,{dy:i*x,x:g.x}),m.appendChild(a._g.doc.createTextNode(j[n])),h.appendChild(m),k[n]=m}else{k=h.getElementsByTagName("tspan");for(n=0,o=k.length;n<o;n++)n?q(k[n],{dy:i*x,x:g.x}):q(k[0],{dy:0})}q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&a.is(r,"finite")&&q(k[0],{dy:r})}},z=function(b,c){var d=0,e=0;this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.matrix=a.matrix(),this.realPath=null,this.paper=c,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},A=a.el;z.prototype=A,A.constructor=z,a._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);d.type="path",w(d,{fill:"none",stroke:"#000",path:a});return d},A.rotate=function(a,b,e){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this.transform(this._.transform.concat([["r",a,b,e]]));return this},A.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]]));return this},A.translate=function(a,b){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this.transform(this._.transform.concat([["t",a,b]]));return this},A.transform=function(c){var d=this._;if(c==null)return d.transform;a._extractTransform(this,c),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix});if(d.sx!=1||d.sy!=1){var e=this.attrs[b]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this},A.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this},A.remove=function(){if(!this.removed&&!!this.node.parentNode){var b=this.paper;b.__set__&&b.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&b.defs.removeChild(this.gradient),a._tear(this,b),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var c in this)this[c]=typeof this[c]=="function"?a._removedFactory(c):null;this.removed=!0}},A._getBBox=function(){if(this.node.style.display=="none"){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}a&&this.hide();return b},A.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(c=="transform")return this._.transform;var g=c.split(j),h={};for(var i=0,l=g.length;i<l;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return l-1?h:h[g[0]]}if(d==null&&a.is(c,"array")){h={};for(i=0,l=c.length;i<l;i++)h[c[i]]=this.attr(c[i]);return h}if(d!=null){var m={};m[c]=d}else c!=null&&a.is(c,"object")&&(m=c);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[b](n)&&m[b](n)&&a.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[b](p)&&(m[p]=o[p])}w(this,m);return this},A.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var b=this.paper;b.top!=this&&a._tofront(this,b);return this},A.toBack=function(){if(this.removed)return this;var b=this.node.parentNode;b.tagName.toLowerCase()=="a"?b.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):b.firstChild!=this.node&&b.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper);var c=this.paper;return this},A.insertAfter=function(b){if(this.removed)return this;var c=b.node||b[b.length-1].node;c.nextSibling?c.parentNode.insertBefore(this.node,c.nextSibling):c.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},A.insertBefore=function(b){if(this.removed)return this;var c=b.node||b[0].node;c.parentNode.insertBefore(this.node,c),a._insertbefore(this,b,this.paper);return this},A.blur=function(b){var c=this;if(+b!==0){var d=q("filter"),e=q("feGaussianBlur");c.attrs.blur=b,d.id=a.createUUID(),q(e,{stdDeviation:+b||1.5}),d.appendChild(e),c.paper.defs.appendChild(d),c._blur=d,q(c.node,{filter:"url(#"+d.id+")"})}else c._blur&&(c._blur.parentNode.removeChild(c._blur),delete c._blur,delete c.attrs.blur),c.node.removeAttribute("filter")},a._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs);return f},a._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs);return h},a._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs);return g},a._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image";return h},a._engine.text=function(b,c,d,e){var f=q("text");b.canvas&&b.canvas.appendChild(f);var g=new z(f,b);g.attrs={x:c,y:d,"text-anchor":"middle",text:e,font:a._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs);return g},a._engine.setSize=function(a,b){this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox);return this},a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b&&b.container,d=b.x,e=b.y,f=b.width,g=b.height;if(!c)throw new Error("SVG container not found.");var h=q("svg"),i="overflow:hidden;",j;d=d||0,e=e||0,f=f||512,g=g||342,q(h,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),c==1?(h.style.cssText=i+"position:absolute;left:"+d+"px;top:"+e+"px",a._g.doc.body.appendChild(h),j=1):(h.style.cssText=i+"position:relative",c.firstChild?c.insertBefore(h,c.firstChild):c.appendChild(h)),c=new a._Paper,c.width=f,c.height=g,c.canvas=h,c.clear(),c._left=c._top=0,j&&(c.renderfix=function(){}),c.renderfix();return c},a._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f=g(c/this.width,d/this.height),h=this.top,i=e?"meet":"xMinYMin",j,l;a==null?(this._vbSize&&(f=1),delete this._vbSize,j="0 0 "+this.width+m+this.height):(this._vbSize=f,j=a+m+b+m+c+m+d),q(this.canvas,{viewBox:j,preserveAspectRatio:i});while(f&&h)l="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":l}),h._.dirty=1,h._.dirtyT=1,h=h.prev;this._viewBox=[a,b,c,d,!!e];return this},a.prototype.renderfix=function(){var a=this.canvas,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}var e=-c.e%1,f=-c.f%1;if(e||f)e&&(this._left=(this._left+e)%1,b.left=this._left+"px"),f&&(this._top=(this._top+f)%1,b.top=this._top+"px")},a.prototype.clear=function(){a.eve("raphael.clear",this);var b=this.canvas;while(b.firstChild)b.removeChild(b.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(a._g.doc.createTextNode("Created with Raphaël "+a.version)),b.appendChild(this.desc),b.appendChild(this.defs=q("defs"))},a.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null};var B=a.st;for(var C in A)A[b](C)&&!B[b](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}(window.Raphael),window.Raphael.vml&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=a.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(b){var d=/[ahqstv]/ig,e=a._pathToAbsolute;c(b).match(d)&&(e=a._path2curve),d=/[clmz]/g;if(e==a._pathToAbsolute&&!c(b).match(d)){var g=c(b).replace(q,function(a,b,c){var d=[],e=b.toLowerCase()=="m",g=p[b];c.replace(s,function(a){e&&d.length==2&&(g+=d+p[b=="m"?"l":"L"],d=[]),d.push(f(a*u))});return g+d});return g}var h=e(b),i,j;g=[];for(var k=0,l=h.length;k<l;k++){i=h[k],j=h[k][0].toLowerCase(),j=="z"&&(j="x");for(var m=1,r=i.length;m<r;m++)j+=f(i[m]*u)+(m!=r-1?",":o);g.push(j)}return g.join(n)},y=function(b,c,d){var e=a.matrix();e.rotate(-b,.5,.5);return{dx:e.x(c,d),dy:e.y(c,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q,r=u/b,s=u/c;m.visibility="hidden";if(!!b&&!!c){l.coordsize=i(r)+n+i(s),m.rotation=f*(b*c<0?-1:1);if(f){var t=y(f,d,e);d=t.dx,e=t.dy}b<0&&(p+="x"),c<0&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-r+n+e*-s;if(k||g.fillsize){var v=l.getElementsByTagName(j);v=v&&v[0],l.removeChild(v),k&&(t=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),v.position=t.dx*o+n+t.dy*o),g.fillsize&&(v.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(v)}m.visibility="visible"}};a.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,b,d){var e=c(b).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";while(g--)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q,r=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),s=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),t=e;for(var y in i)i[b](y)&&(m[y]=i[y]);r&&(m.path=a._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur);if(i.path&&e.type=="path"||r)l.path=x(~c(m.path).toLowerCase().indexOf("r")?a._pathToAbsolute(m.path):m.path),e.type=="image"&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0));"transform"in i&&e.transform(i.transform);if(s){var B=+m.cx,D=+m.cy,E=+m.rx||+m.r||0,G=+m.ry||+m.r||0;l.path=a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((B-E)*u),f((D-G)*u),f((B+E)*u),f((D+G)*u),f(B*u))}if("clip-rect"in i){var H=c(i["clip-rect"]).split(k);if(H.length==4){H[2]=+H[2]+ +H[0],H[3]=+H[3]+ +H[1];var I=l.clipRect||a._g.doc.createElement("div"),J=I.style;J.clip=a.format("rect({1}px {2}px {3}px {0}px)",H),l.clipRect||(J.position="absolute",J.top=0,J.left=0,J.width=e.paper.width+"px",J.height=e.paper.height+"px",l.parentNode.insertBefore(I,l),I.appendChild(l),l.clipRect=I)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var K=e.textpath.style;i.font&&(K.font=i.font),i["font-family"]&&(K.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(K.fontSize=i["font-size"]),i["font-weight"]&&(K.fontWeight=i["font-weight"]),i["font-style"]&&(K.fontStyle=i["font-style"])}"arrow-start"in i&&A(t,i["arrow-start"]),"arrow-end"in i&&A(t,i["arrow-end"],1);if(i.opacity!=null||i["stroke-width"]!=null||i.fill!=null||i.src!=null||i.stroke!=null||i["stroke-width"]!=null||i["stroke-opacity"]!=null||i["fill-opacity"]!=null||i["stroke-dasharray"]!=null||i["stroke-miterlimit"]!=null||i["stroke-linejoin"]!=null||i["stroke-linecap"]!=null){var L=l.getElementsByTagName(j),M=!1;L=L&&L[0],!L&&(M=L=F(j)),e.type=="image"&&i.src&&(L.src=i.src),i.fill&&(L.on=!0);if(L.on==null||i.fill=="none"||i.fill===null)L.on=!1;if(L.on&&i.fill){var N=c(i.fill).match(a._ISURL);if(N){L.parentNode==l&&l.removeChild(L),L.rotate=!0,L.src=N[1],L.type="tile";var O=e.getBBox(1);L.position=O.x+n+O.y,e._.fillpos=[O.x,O.y],a._preload(N[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else L.color=a.getRGB(i.fill).hex,L.src=o,L.type="solid",a.getRGB(i.fill).error&&(t.type in{circle:1,ellipse:1}||c(i.fill).charAt()!="r")&&C(t,i.fill,L)&&(m.fill="none",m.gradient=i.fill,L.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var P=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+a.getRGB(i.fill).o+1||2)-1);P=h(g(P,0),1),L.opacity=P,L.src&&(L.color="none")}l.appendChild(L);var Q=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],T=!1;!Q&&(T=Q=F("stroke"));if(i.stroke&&i.stroke!="none"||i["stroke-width"]||i["stroke-opacity"]!=null||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])Q.on=!0;(i.stroke=="none"||i.stroke===null||Q.on==null||i.stroke==0||i["stroke-width"]==0)&&(Q.on=!1);var U=a.getRGB(i.stroke);Q.on&&i.stroke&&(Q.color=U.hex),P=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+U.o+1||2)-1);var V=(d(i["stroke-width"])||1)*.75;P=h(g(P,0),1),i["stroke-width"]==null&&(V=m["stroke-width"]),i["stroke-width"]&&(Q.weight=V),V&&V<1&&(P*=V)&&(Q.weight=1),Q.opacity=P,i["stroke-linejoin"]&&(Q.joinstyle=i["stroke-linejoin"]||"miter"),Q.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(Q.endcap=i["stroke-linecap"]=="butt"?"flat":i["stroke-linecap"]=="square"?"square":"round");if(i["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};Q.dashstyle=W[b](i["stroke-dasharray"])?W[i["stroke-dasharray"]]:o}T&&l.appendChild(Q)}if(t.type=="text"){t.paper.canvas.style.display=o;var X=t.paper.span,Y=100,Z=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=X.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),Z=d(m["font-size"]||Z&&Z[0])||10,p.fontSize=Z*Y+"px",t.textpath.string&&(X.innerHTML=c(t.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();t.W=m.w=($.right-$.left)/Y,t.H=m.h=($.bottom-$.top)/Y,t.X=m.x,t.Y=m.y+t.H/2,("x"in i||"y"in i)&&(t.path.v=a.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));var _=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var ba=0,bb=_.length;ba<bb;ba++)if(_[ba]in i){t._.dirty=1;break}switch(m["text-anchor"]){case"start":t.textpath.style["v-text-align"]="left",t.bbx=t.W/2;break;case"end":t.textpath.style["v-text-align"]="right",t.bbx=-t.W/2;break;default:t.textpath.style["v-text-align"]="center",t.bbx=0}t.textpath.style["v-text-kern"]=!0}},C=function(b,f,g){b.attrs=b.attrs||{};var h=b.attrs,i=Math.pow,j,k,l="linear",m=".5 .5";b.attrs.gradient=f,f=c(f).replace(a._radial_gradient,function(a,b,c){l="radial",b&&c&&(b=d(b),c=d(c),i(b-.5,2)+i(c-.5,2)>.25&&(c=e.sqrt(.25-i(b-.5,2))*((c>.5)*2-1)+.5),m=b+n+c);return o}),f=f.split(/\s*\-\s*/);if(l=="linear"){var p=f.shift();p=-d(p);if(isNaN(p))return null}var q=a._parseDots(f);if(!q)return null;b=b.shape||b.node;if(q.length){b.removeChild(g),g.on=!0,g.method="none",g.color=q[0].color,g.color2=q[q.length-1].color;var r=[];for(var s=0,t=q.length;s<t;s++)q[s].offset&&r.push(q[s].offset+n+q[s].color);g.colors=r.length?r.join():"0% "+g.color,l=="radial"?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=m,g.angle=0):(g.type="gradient",g.angle=(270-p)%360),b.appendChild(g)}return 1},D=function(b,c){this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=c,this.matrix=a.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},E=a.el;D.prototype=E,E.constructor=D,E.transform=function(b){if(b==null)return this._.transform;var d=this.paper._viewBoxShift,e=d?"s"+[d.scale,d.scale]+"-1-1t"+[d.dx,d.dy]:o,f;d&&(f=b=c(b).replace(/\.{3}|\u2026/g,this._.transform||o)),a._extractTransform(this,e+b);var g=this.matrix.clone(),h=this.skew,i=this.node,j,k=~c(this.attrs.fill).indexOf("-"),l=!c(this.attrs.fill).indexOf("url(");g.translate(-0.5,-0.5);if(l||k||this.type=="image"){h.matrix="1 0 0 1",h.offset="0 0",j=g.split();if(k&&j.noRotation||!j.isSimple){i.style.filter=g.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;i.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else i.style.filter=o,z(this,j.scalex,j.scaley,j.dx,j.dy,j.rotate)}else i.style.filter=o,h.matrix=c(g),h.offset=g.offset();f&&(this._.transform=f);return this},E.rotate=function(a,b,e){if(this.removed)return this;if(a!=null){a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,b,e]]));return this}},E.translate=function(a,b){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=b),this.transform(this._.transform.concat([["t",a,b]]));return this},E.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]])),this._.dirtyT=1;return this},E.hide=function(){!this.removed&&(this.node.style.display="none");return this},E.show=function(){!this.removed&&(this.node.style.display=o);return this},E._getBBox=function(){if(this.removed)return{};return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),a.eve.unbind("raphael.*.*."+this.id),a._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;this.removed=!0}},E.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c==j&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var g=c.split(k),h={};for(var i=0,m=g.length;i<m;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return m-1?h:h[g[0]]}if(this.attrs&&d==null&&a.is(c,"array")){h={};for(i=0,m=c.length;i<m;i++)h[c[i]]=this.attr(c[i]);return h}var n;d!=null&&(n={},n[c]=d),d==null&&a.is(c,"object")&&(n=c);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[b](o)&&n[b](o)&&a.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[b](q)&&(n[q]=p[q])}n.text&&this.type=="text"&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&a._tofront(this,this.paper);return this},E.toBack=function(){if(this.removed)return this;this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper));return this},E.insertAfter=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[b.length-1]),b.node.nextSibling?b.node.parentNode.insertBefore(this.node,b.node.nextSibling):b.node.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},E.insertBefore=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[0]),b.node.parentNode.insertBefore(this.node,b.node),a._insertbefore(this,b,this.paper);return this},E.blur=function(b){var c=this.node.runtimeStyle,d=c.filter;d=d.replace(r,o),+b!==0?(this.attrs.blur=b,c.filter=d+n+m+".Blur(pixelradius="+(+b||1.5)+")",c.margin=a.format("-{0}px 0 0 -{0}px",f(+b||1.5))):(c.filter=d,c.margin=0,delete this.attrs.blur)},a._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");f.on=!0,c.appendChild(f),d.skew=f,d.transform(o);return d},a._engine.rect=function(b,c,d,e,f,g){var h=a._rectPath(c,d,e,f,g),i=b.path(h),j=i.attrs;i.X=j.x=c,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect";return i},a._engine.ellipse=function(a,b,c,d,e){var f=a.path(),g=f.attrs;f.X=b-d,f.Y=c-e,f.W=d*2,f.H=e*2,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e});return f},a._engine.circle=function(a,b,c,d){var e=a.path(),f=e.attrs;e.X=b-d,e.Y=c-d,e.W=e.H=d*2,e.type="circle",B(e,{cx:b,cy:c,r:d});return e},a._engine.image=function(b,c,d,e,f,g){var h=a._rectPath(d,e,f,g),i=b.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];k.src=c,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=c,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0);return i},a._engine.text=function(b,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=a.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=c(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,b),l={fill:"#000",stroke:"none",font:a._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=c(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),b.canvas.appendChild(h);var m=F("skew");m.on=!0,h.appendChild(m),k.skew=m,k.transform(o);return k},a._engine.setSize=function(b,c){var d=this.canvas.style;this.width=b,this.height=c,b==+b&&(b+="px"),c==+c&&(c+="px"),d.width=b,d.height=c,d.clip="rect(0 "+b+" "+c+" 0)",this._viewBox&&a._engine.setViewBox.apply(this,this._viewBox);return this},a._engine.setViewBox=function(b,c,d,e,f){a.eve("raphael.setViewBox",this,this._viewBox,[b,c,d,e,f]);var h=this.width,i=this.height,j=1/g(d/h,e/i),k,l;f&&(k=i/e,l=h/d,d*k<h&&(b-=(h-d*k)/2/k),e*l<i&&(c-=(i-e*l)/2/l)),this._viewBox=[b,c,d,e,!!f],this._viewBoxShift={dx:-b,dy:-c,scale:j},this.forEach(function(a){a.transform("...")});return this};var F;a._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},a._engine.initWin(a._g.win),a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b.container,d=b.height,e,f=b.width,g=b.x,h=b.y;if(!c)throw new Error("VML container not found.");var i=new a._Paper,j=i.canvas=a._g.doc.createElement("div"),k=j.style;g=g||0,h=h||0,f=f||512,d=d||342,i.width=f,i.height=d,f==+f&&(f+="px"),d==+d&&(d+="px"),i.coordsize=u*1e3+n+u*1e3,i.coordorigin="0 0",i.span=a._g.doc.createElement("span"),i.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",j.appendChild(i.span),k.cssText=a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",f,d),c==1?(a._g.doc.body.appendChild(j),k.left=g+"px",k.top=h+"px",k.position="absolute"):c.firstChild?c.insertBefore(j,c.firstChild):c.appendChild(j),i.renderfix=function(){};return i},a.prototype.clear=function(){a.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=a._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},a.prototype.remove=function(){a.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;return!0};var G=a.st;for(var H in E)E[b](H)&&!G[b](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}(window.Raphael)
;
/**
 * sidebarEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */

 var SidebarMenuEffects = (function() {

  function hasParentClass( e, classname ) {
    if(e === document) return false;
    if( classie.has( e, classname ) ) {
      return true;
    }
    return e.parentNode && hasParentClass( e.parentNode, classname );
  }

  // http://coveroverflow.com/a/11381730/989439
  function mobilecheck() {
    var check = false;
    (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  function init() {

    var container = document.getElementById( 'st-container' ),
        cookieButton = document.getElementById( 'cookieButton' ),
      buttons = Array.prototype.slice.call( document.querySelectorAll( '#st-trigger-effects > a' ) ),
      // event type (if mobile use touch events)
      eventtype = mobilecheck() ? 'touchstart' : 'click',
      resetMenu = function() {
        classie.remove( container, 'st-menu-open' );
        classie.remove( cookieButton, 'disparu' );
        classie.remove( cookieButton, 'enOut' );
        console.log('menu reset');
      },
      bodyClickFn = function(evt) {
        if( !hasParentClass( evt.target, 'st-menu' ) ) {
          resetMenu();
          document.removeEventListener( eventtype, bodyClickFn );
        }
      };

    buttons.forEach( function( el, i ) {
      var effect = el.getAttribute( 'data-effect' );
      console.log(effect);
      el.addEventListener( eventtype, function( ev ) {
        ev.stopPropagation();
        ev.preventDefault();
        container.className = 'st-container'; // clear
        classie.add( container, effect );
        classie.add( cookieButton, 'enOut' )
        requestTimeout( function() {
          classie.add( container, 'st-menu-open' );
          classie.add( cookieButton, 'disparu' );
        }, 25 );
        document.addEventListener( eventtype, bodyClickFn );
      });
    } );

  }

  init();

})();
/*
 * Copyright (c) 2013 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.0.1 (July 2013)
 *
 * Licensed under the MIT License
 */


(function(a){a.fn.succinct=function(b){var c={size:240,omission:"...",ignore:true},b=a.extend(c,b);return this.each(function(){var e,d,h=a(this),g=/[!-\/:-@\[-`{-~]$/;var f=function(){h.each(function(){e=a(this).text();if(e.length>b.size){d=a.trim(e).substring(0,b.size).split(" ").slice(0,-1).join(" ");if(b.ignore){d=d.replace(g,"")}a(this).text(d+b.omission)}})};var i=function(){f()};i()})}})(jQuery);
/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */


(function (window, document, $, undefined) {
  "use strict";

  var H = $("html"),
    W = $(window),
    D = $(document),
    F = $.fancybox = function () {
      F.open.apply( this, arguments );
    },
    IE =  navigator.userAgent.match(/msie/i),
    didUpdate = null,
    isTouch   = document.createTouch !== undefined,

    isQuery = function(obj) {
      return obj && obj.hasOwnProperty && obj instanceof $;
    },
    isString = function(str) {
      return str && $.type(str) === "string";
    },
    isPercentage = function(str) {
      return isString(str) && str.indexOf('%') > 0;
    },
    isScrollable = function(el) {
      return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
    },
    getScalar = function(orig, dim) {
      var value = parseInt(orig, 10) || 0;

      if (dim && isPercentage(orig)) {
        value = F.getViewport()[ dim ] / 100 * value;
      }

      return Math.ceil(value);
    },
    getValue = function(value, dim) {
      return getScalar(value, dim) + 'px';
    };

  $.extend(F, {
    // The current version of fancyBox
    version: '2.1.5',

    defaults: {
      padding : 15,
      margin  : 20,

      width     : 800,
      height    : 600,
      minWidth  : 100,
      minHeight : 100,
      maxWidth  : 9999,
      maxHeight : 9999,
      pixelRatio: 1, // Set to 2 for retina display support

      autoSize   : true,
      autoHeight : false,
      autoWidth  : false,

      autoResize  : true,
      autoCenter  : !isTouch,
      fitToView   : true,
      aspectRatio : false,
      topRatio    : 0.5,
      leftRatio   : 0.5,

      scrolling : 'auto', // 'auto', 'yes' or 'no'
      wrapCSS   : '',

      arrows     : true,
      closeBtn   : true,
      closeClick : false,
      nextClick  : false,
      mouseWheel : true,
      autoPlay   : false,
      playSpeed  : 3000,
      preload    : 3,
      modal      : false,
      loop       : true,

      ajax  : {
        dataType : 'html',
        headers  : { 'X-fancyBox': true }
      },
      iframe : {
        scrolling : 'auto',
        preload   : true
      },
      swf : {
        wmode: 'transparent',
        allowfullscreen   : 'true',
        allowscriptaccess : 'always'
      },

      keys  : {
        next : {
          13 : 'left', // enter
          34 : 'up',   // page down
          39 : 'left', // right arrow
          40 : 'up'    // down arrow
        },
        prev : {
          8  : 'right',  // backspace
          33 : 'down',   // page up
          37 : 'right',  // left arrow
          38 : 'down'    // up arrow
        },
        close  : [27], // escape key
        play   : [32], // space - start/stop slideshow
        toggle : [70]  // letter "f" - toggle fullscreen
      },

      direction : {
        next : 'left',
        prev : 'right'
      },

      scrollOutside  : true,

      // Override some properties
      index   : 0,
      type    : null,
      href    : null,
      content : null,
      title   : null,

      // HTML templates
      tpl: {
        wrap     : '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
        image    : '<img class="fancybox-image" src="{href}" alt="" />',
        iframe   : '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
        error    : '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
        closeBtn : '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
        next     : '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
        prev     : '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
      },

      // Properties for each animation type
      // Opening fancyBox
      openEffect  : 'fade', // 'elastic', 'fade' or 'none'
      openSpeed   : 250,
      openEasing  : 'swing',
      openOpacity : true,
      openMethod  : 'zoomIn',

      // Closing fancyBox
      closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
      closeSpeed   : 250,
      closeEasing  : 'swing',
      closeOpacity : true,
      closeMethod  : 'zoomOut',

      // Changing next gallery item
      nextEffect : 'elastic', // 'elastic', 'fade' or 'none'
      nextSpeed  : 250,
      nextEasing : 'swing',
      nextMethod : 'changeIn',

      // Changing previous gallery item
      prevEffect : 'elastic', // 'elastic', 'fade' or 'none'
      prevSpeed  : 250,
      prevEasing : 'swing',
      prevMethod : 'changeOut',

      // Enable default helpers
      helpers : {
        overlay : true,
        title   : true
      },

      // Callbacks
      onCancel     : $.noop, // If canceling
      beforeLoad   : $.noop, // Before loading
      afterLoad    : $.noop, // After loading
      beforeShow   : $.noop, // Before changing in current item
      afterShow    : $.noop, // After opening
      beforeChange : $.noop, // Before changing gallery item
      beforeClose  : $.noop, // Before closing
      afterClose   : $.noop  // After closing
    },

    //Current state
    group    : {}, // Selected group
    opts     : {}, // Group options
    previous : null,  // Previous element
    coming   : null,  // Element being loaded
    current  : null,  // Currently loaded element
    isActive : false, // Is activated
    isOpen   : false, // Is currently open
    isOpened : false, // Have been fully opened at least once

    wrap  : null,
    skin  : null,
    outer : null,
    inner : null,

    player : {
      timer    : null,
      isActive : false
    },

    // Loaders
    ajaxLoad   : null,
    imgPreload : null,

    // Some collections
    transitions : {},
    helpers     : {},

    /*
     *  Static methods
     */

    open: function (group, opts) {
      if (!group) {
        return;
      }

      if (!$.isPlainObject(opts)) {
        opts = {};
      }

      // Close if already active
      if (false === F.close(true)) {
        return;
      }

      // Normalize group
      if (!$.isArray(group)) {
        group = isQuery(group) ? $(group).get() : [group];
      }

      // Recheck if the type of each element is `object` and set content type (image, ajax, etc)
      $.each(group, function(i, element) {
        var obj = {},
          href,
          title,
          content,
          type,
          rez,
          hrefParts,
          selector;

        if ($.type(element) === "object") {
          // Check if is DOM element
          if (element.nodeType) {
            element = $(element);
          }

          if (isQuery(element)) {
            obj = {
              href    : element.data('fancybox-href') || element.attr('href'),
              title   : element.data('fancybox-title') || element.attr('title'),
              isDom   : true,
              element : element
            };

            if ($.metadata) {
              $.extend(true, obj, element.metadata());
            }

          } else {
            obj = element;
          }
        }

        href  = opts.href  || obj.href || (isString(element) ? element : null);
        title = opts.title !== undefined ? opts.title : obj.title || '';

        content = opts.content || obj.content;
        type    = content ? 'html' : (opts.type  || obj.type);

        if (!type && obj.isDom) {
          type = element.data('fancybox-type');

          if (!type) {
            rez  = element.prop('class').match(/fancybox\.(\w+)/);
            type = rez ? rez[1] : null;
          }
        }

        if (isString(href)) {
          // Try to guess the content type
          if (!type) {
            if (F.isImage(href)) {
              type = 'image';

            } else if (F.isSWF(href)) {
              type = 'swf';

            } else if (href.charAt(0) === '#') {
              type = 'inline';

            } else if (isString(element)) {
              type    = 'html';
              content = element;
            }
          }

          // Split url into two pieces with source url and content selector, e.g,
          // "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
          if (type === 'ajax') {
            hrefParts = href.split(/\s+/, 2);
            href      = hrefParts.shift();
            selector  = hrefParts.shift();
          }
        }

        if (!content) {
          if (type === 'inline') {
            if (href) {
              content = $( isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href ); //strip for ie7

            } else if (obj.isDom) {
              content = element;
            }

          } else if (type === 'html') {
            content = href;

          } else if (!type && !href && obj.isDom) {
            type    = 'inline';
            content = element;
          }
        }

        $.extend(obj, {
          href     : href,
          type     : type,
          content  : content,
          title    : title,
          selector : selector
        });

        group[ i ] = obj;
      });

      // Extend the defaults
      F.opts = $.extend(true, {}, F.defaults, opts);

      // All options are merged recursive except keys
      if (opts.keys !== undefined) {
        F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
      }

      F.group = group;

      return F._start(F.opts.index);
    },

    // Cancel image loading or abort ajax request
    cancel: function () {
      var coming = F.coming;

      if (!coming || false === F.trigger('onCancel')) {
        return;
      }

      F.hideLoading();

      if (F.ajaxLoad) {
        F.ajaxLoad.abort();
      }

      F.ajaxLoad = null;

      if (F.imgPreload) {
        F.imgPreload.onload = F.imgPreload.onerror = null;
      }

      if (coming.wrap) {
        coming.wrap.stop(true, true).trigger('onReset').remove();
      }

      F.coming = null;

      // If the first item has been canceled, then clear everything
      if (!F.current) {
        F._afterZoomOut( coming );
      }
    },

    // Start closing animation if is open; remove immediately if opening/closing
    close: function (event) {
      F.cancel();

      if (false === F.trigger('beforeClose')) {
        return;
      }

      F.unbindEvents();

      if (!F.isActive) {
        return;
      }

      if (!F.isOpen || event === true) {
        $('.fancybox-wrap').stop(true).trigger('onReset').remove();

        F._afterZoomOut();

      } else {
        F.isOpen = F.isOpened = false;
        F.isClosing = true;

        $('.fancybox-item, .fancybox-nav').remove();

        F.wrap.stop(true, true).removeClass('fancybox-opened');

        F.transitions[ F.current.closeMethod ]();
      }
    },

    // Manage slideshow:
    //   $.fancybox.play(); - toggle slideshow
    //   $.fancybox.play( true ); - start
    //   $.fancybox.play( false ); - stop
    play: function ( action ) {
      var clear = function () {
          clearTimeout(F.player.timer);
        },
        set = function () {
          clear();

          if (F.current && F.player.isActive) {
            F.player.timer = setTimeout(F.next, F.current.playSpeed);
          }
        },
        stop = function () {
          clear();

          D.unbind('.player');

          F.player.isActive = false;

          F.trigger('onPlayEnd');
        },
        start = function () {
          if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
            F.player.isActive = true;

            D.bind({
              'onCancel.player beforeClose.player' : stop,
              'onUpdate.player'   : set,
              'beforeLoad.player' : clear
            });

            set();

            F.trigger('onPlayStart');
          }
        };

      if (action === true || (!F.player.isActive && action !== false)) {
        start();
      } else {
        stop();
      }
    },

    // Navigate to next gallery item
    next: function ( direction ) {
      var current = F.current;

      if (current) {
        if (!isString(direction)) {
          direction = current.direction.next;
        }

        F.jumpto(current.index + 1, direction, 'next');
      }
    },

    // Navigate to previous gallery item
    prev: function ( direction ) {
      var current = F.current;

      if (current) {
        if (!isString(direction)) {
          direction = current.direction.prev;
        }

        F.jumpto(current.index - 1, direction, 'prev');
      }
    },

    // Navigate to gallery item by index
    jumpto: function ( index, direction, router ) {
      var current = F.current;

      if (!current) {
        return;
      }

      index = getScalar(index);

      F.direction = direction || current.direction[ (index >= current.index ? 'next' : 'prev') ];
      F.router    = router || 'jumpto';

      if (current.loop) {
        if (index < 0) {
          index = current.group.length + (index % current.group.length);
        }

        index = index % current.group.length;
      }

      if (current.group[ index ] !== undefined) {
        F.cancel();

        F._start(index);
      }
    },

    // Center inside viewport and toggle position type to fixed or absolute if needed
    reposition: function (e, onlyAbsolute) {
      var current = F.current,
        wrap    = current ? current.wrap : null,
        pos;

      if (wrap) {
        pos = F._getPosition(onlyAbsolute);

        if (e && e.type === 'scroll') {
          delete pos.position;

          wrap.stop(true, true).animate(pos, 200);

        } else {
          wrap.css(pos);

          current.pos = $.extend({}, current.dim, pos);
        }
      }
    },

    update: function (e) {
      var type = (e && e.type),
        anyway = !type || type === 'orientationchange';

      if (anyway) {
        clearTimeout(didUpdate);

        didUpdate = null;
      }

      if (!F.isOpen || didUpdate) {
        return;
      }

      didUpdate = setTimeout(function() {
        var current = F.current;

        if (!current || F.isClosing) {
          return;
        }

        F.wrap.removeClass('fancybox-tmp');

        if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
          F._setDimension();
        }

        if (!(type === 'scroll' && current.canShrink)) {
          F.reposition(e);
        }

        F.trigger('onUpdate');

        didUpdate = null;

      }, (anyway && !isTouch ? 0 : 300));
    },

    // Shrink content to fit inside viewport or restore if resized
    toggle: function ( action ) {
      if (F.isOpen) {
        F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

        // Help browser to restore document dimensions
        if (isTouch) {
          F.wrap.removeAttr('style').addClass('fancybox-tmp');

          F.trigger('onUpdate');
        }

        F.update();
      }
    },

    hideLoading: function () {
      D.unbind('.loading');

      $('#fancybox-loading').remove();
    },

    showLoading: function () {
      var el, viewport;

      F.hideLoading();

      el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

      // If user will press the escape-button, the request will be canceled
      D.bind('keydown.loading', function(e) {
        if ((e.which || e.keyCode) === 27) {
          e.preventDefault();

          F.cancel();
        }
      });

      if (!F.defaults.fixed) {
        viewport = F.getViewport();

        el.css({
          position : 'absolute',
          top  : (viewport.h * 0.5) + viewport.y,
          left : (viewport.w * 0.5) + viewport.x
        });
      }
    },

    getViewport: function () {
      var locked = (F.current && F.current.locked) || false,
        rez    = {
          x: W.scrollLeft(),
          y: W.scrollTop()
        };

      if (locked) {
        rez.w = locked[0].clientWidth;
        rez.h = locked[0].clientHeight;

      } else {
        // See http://bugs.jquery.com/ticket/6724
        rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
        rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
      }

      return rez;
    },

    // Unbind the keyboard / clicking actions
    unbindEvents: function () {
      if (F.wrap && isQuery(F.wrap)) {
        F.wrap.unbind('.fb');
      }

      D.unbind('.fb');
      W.unbind('.fb');
    },

    bindEvents: function () {
      var current = F.current,
        keys;

      if (!current) {
        return;
      }

      // Changing document height on iOS devices triggers a 'resize' event,
      // that can change document height... repeating infinitely
      W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

      keys = current.keys;

      if (keys) {
        D.bind('keydown.fb', function (e) {
          var code   = e.which || e.keyCode,
            target = e.target || e.srcElement;

          // Skip esc key if loading, because showLoading will cancel preloading
          if (code === 27 && F.coming) {
            return false;
          }

          // Ignore key combinations and key events within form elements
          if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
            $.each(keys, function(i, val) {
              if (current.group.length > 1 && val[ code ] !== undefined) {
                F[ i ]( val[ code ] );

                e.preventDefault();
                return false;
              }

              if ($.inArray(code, val) > -1) {
                F[ i ] ();

                e.preventDefault();
                return false;
              }
            });
          }
        });
      }

      if ($.fn.mousewheel && current.mouseWheel) {
        F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
          var target = e.target || null,
            parent = $(target),
            canScroll = false;

          while (parent.length) {
            if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
              break;
            }

            canScroll = isScrollable( parent[0] );
            parent    = $(parent).parent();
          }

          if (delta !== 0 && !canScroll) {
            if (F.group.length > 1 && !current.canShrink) {
              if (deltaY > 0 || deltaX > 0) {
                F.prev( deltaY > 0 ? 'down' : 'left' );

              } else if (deltaY < 0 || deltaX < 0) {
                F.next( deltaY < 0 ? 'up' : 'right' );
              }

              e.preventDefault();
            }
          }
        });
      }
    },

    trigger: function (event, o) {
      var ret, obj = o || F.coming || F.current;

      if (!obj) {
        return;
      }

      if ($.isFunction( obj[event] )) {
        ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
      }

      if (ret === false) {
        return false;
      }

      if (obj.helpers) {
        $.each(obj.helpers, function (helper, opts) {
          if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
            F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
          }
        });
      }

      D.trigger(event);
    },

    isImage: function (str) {
      return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
    },

    isSWF: function (str) {
      return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
    },

    _start: function (index) {
      var coming = {},
        obj,
        href,
        type,
        margin,
        padding;

      index = getScalar( index );
      obj   = F.group[ index ] || null;

      if (!obj) {
        return false;
      }

      coming = $.extend(true, {}, F.opts, obj);

      // Convert margin and padding properties to array - top, right, bottom, left
      margin  = coming.margin;
      padding = coming.padding;

      if ($.type(margin) === 'number') {
        coming.margin = [margin, margin, margin, margin];
      }

      if ($.type(padding) === 'number') {
        coming.padding = [padding, padding, padding, padding];
      }

      // 'modal' propery is just a shortcut
      if (coming.modal) {
        $.extend(true, coming, {
          closeBtn   : false,
          closeClick : false,
          nextClick  : false,
          arrows     : false,
          mouseWheel : false,
          keys       : null,
          helpers: {
            overlay : {
              closeClick : false
            }
          }
        });
      }

      // 'autoSize' property is a shortcut, too
      if (coming.autoSize) {
        coming.autoWidth = coming.autoHeight = true;
      }

      if (coming.width === 'auto') {
        coming.autoWidth = true;
      }

      if (coming.height === 'auto') {
        coming.autoHeight = true;
      }

      /*
       * Add reference to the group, so it`s possible to access from callbacks, example:
       * afterLoad : function() {
       *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
       * }
       */

      coming.group  = F.group;
      coming.index  = index;

      // Give a chance for callback or helpers to update coming item (type, title, etc)
      F.coming = coming;

      if (false === F.trigger('beforeLoad')) {
        F.coming = null;

        return;
      }

      type = coming.type;
      href = coming.href;

      if (!type) {
        F.coming = null;

        //If we can not determine content type then drop silently or display next/prev item if looping through gallery
        if (F.current && F.router && F.router !== 'jumpto') {
          F.current.index = index;

          return F[ F.router ]( F.direction );
        }

        return false;
      }

      F.isActive = true;

      if (type === 'image' || type === 'swf') {
        coming.autoHeight = coming.autoWidth = false;
        coming.scrolling  = 'visible';
      }

      if (type === 'image') {
        coming.aspectRatio = true;
      }

      if (type === 'iframe' && isTouch) {
        coming.scrolling = 'scroll';
      }

      // Build the neccessary markup
      coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo( coming.parent || 'body' );

      $.extend(coming, {
        skin  : $('.fancybox-skin',  coming.wrap),
        outer : $('.fancybox-outer', coming.wrap),
        inner : $('.fancybox-inner', coming.wrap)
      });

      $.each(["Top", "Right", "Bottom", "Left"], function(i, v) {
        coming.skin.css('padding' + v, getValue(coming.padding[ i ]));
      });

      F.trigger('onReady');

      // Check before try to load; 'inline' and 'html' types need content, others - href
      if (type === 'inline' || type === 'html') {
        if (!coming.content || !coming.content.length) {
          return F._error( 'content' );
        }

      } else if (!href) {
        return F._error( 'href' );
      }

      if (type === 'image') {
        F._loadImage();

      } else if (type === 'ajax') {
        F._loadAjax();

      } else if (type === 'iframe') {
        F._loadIframe();

      } else {
        F._afterLoad();
      }
    },

    _error: function ( type ) {
      $.extend(F.coming, {
        type       : 'html',
        autoWidth  : true,
        autoHeight : true,
        minWidth   : 0,
        minHeight  : 0,
        scrolling  : 'no',
        hasError   : type,
        content    : F.coming.tpl.error
      });

      F._afterLoad();
    },

    _loadImage: function () {
      // Reset preload image so it is later possible to check "complete" property
      var img = F.imgPreload = new Image();

      img.onload = function () {
        this.onload = this.onerror = null;

        F.coming.width  = this.width / F.opts.pixelRatio;
        F.coming.height = this.height / F.opts.pixelRatio;

        F._afterLoad();
      };

      img.onerror = function () {
        this.onload = this.onerror = null;

        F._error( 'image' );
      };

      img.src = F.coming.href;

      if (img.complete !== true) {
        F.showLoading();
      }
    },

    _loadAjax: function () {
      var coming = F.coming;

      F.showLoading();

      F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
        url: coming.href,
        error: function (jqXHR, textStatus) {
          if (F.coming && textStatus !== 'abort') {
            F._error( 'ajax', jqXHR );

          } else {
            F.hideLoading();
          }
        },
        success: function (data, textStatus) {
          if (textStatus === 'success') {
            coming.content = data;

            F._afterLoad();
          }
        }
      }));
    },

    _loadIframe: function() {
      var coming = F.coming,
        iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
          .attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
          .attr('src', coming.href);

      // This helps IE
      $(coming.wrap).bind('onReset', function () {
        try {
          $(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
        } catch (e) {}
      });

      if (coming.iframe.preload) {
        F.showLoading();

        iframe.one('load', function() {
          $(this).data('ready', 1);

          // iOS will lose scrolling if we resize
          if (!isTouch) {
            $(this).bind('load.fb', F.update);
          }

          // Without this trick:
          //   - iframe won't scroll on iOS devices
          //   - IE7 sometimes displays empty iframe
          $(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

          F._afterLoad();
        });
      }

      coming.content = iframe.appendTo( coming.inner );

      if (!coming.iframe.preload) {
        F._afterLoad();
      }
    },

    _preloadImages: function() {
      var group   = F.group,
        current = F.current,
        len     = group.length,
        cnt     = current.preload ? Math.min(current.preload, len - 1) : 0,
        item,
        i;

      for (i = 1; i <= cnt; i += 1) {
        item = group[ (current.index + i ) % len ];

        if (item.type === 'image' && item.href) {
          new Image().src = item.href;
        }
      }
    },

    _afterLoad: function () {
      var coming   = F.coming,
        previous = F.current,
        placeholder = 'fancybox-placeholder',
        current,
        content,
        type,
        scrolling,
        href,
        embed;

      F.hideLoading();

      if (!coming || F.isActive === false) {
        return;
      }

      if (false === F.trigger('afterLoad', coming, previous)) {
        coming.wrap.stop(true).trigger('onReset').remove();

        F.coming = null;

        return;
      }

      if (previous) {
        F.trigger('beforeChange', previous);

        previous.wrap.stop(true).removeClass('fancybox-opened')
          .find('.fancybox-item, .fancybox-nav')
          .remove();
      }

      F.unbindEvents();

      current   = coming;
      content   = coming.content;
      type      = coming.type;
      scrolling = coming.scrolling;

      $.extend(F, {
        wrap  : current.wrap,
        skin  : current.skin,
        outer : current.outer,
        inner : current.inner,
        current  : current,
        previous : previous
      });

      href = current.href;

      switch (type) {
        case 'inline':
        case 'ajax':
        case 'html':
          if (current.selector) {
            content = $('<div>').html(content).find(current.selector);

          } else if (isQuery(content)) {
            if (!content.data(placeholder)) {
              content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter( content ).hide() );
            }

            content = content.show().detach();

            current.wrap.bind('onReset', function () {
              if ($(this).find(content).length) {
                content.hide().replaceAll( content.data(placeholder) ).data(placeholder, false);
              }
            });
          }
        break;

        case 'image':
          content = current.tpl.image.replace('{href}', href);
        break;

        case 'swf':
          content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
          embed   = '';

          $.each(current.swf, function(name, val) {
            content += '<param name="' + name + '" value="' + val + '"></param>';
            embed   += ' ' + name + '="' + val + '"';
          });

          content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
        break;
      }

      if (!(isQuery(content) && content.parent().is(current.inner))) {
        current.inner.append( content );
      }

      // Give a chance for helpers or callbacks to update elements
      F.trigger('beforeShow');

      // Set scrolling before calculating dimensions
      current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

      // Set initial dimensions and start position
      F._setDimension();

      F.reposition();

      F.isOpen = false;
      F.coming = null;

      F.bindEvents();

      if (!F.isOpened) {
        $('.fancybox-wrap').not( current.wrap ).stop(true).trigger('onReset').remove();

      } else if (previous.prevMethod) {
        F.transitions[ previous.prevMethod ]();
      }

      F.transitions[ F.isOpened ? current.nextMethod : current.openMethod ]();

      F._preloadImages();
    },

    _setDimension: function () {
      var viewport   = F.getViewport(),
        steps      = 0,
        canShrink  = false,
        canExpand  = false,
        wrap       = F.wrap,
        skin       = F.skin,
        inner      = F.inner,
        current    = F.current,
        width      = current.width,
        height     = current.height,
        minWidth   = current.minWidth,
        minHeight  = current.minHeight,
        maxWidth   = current.maxWidth,
        maxHeight  = current.maxHeight,
        scrolling  = current.scrolling,
        scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
        margin     = current.margin,
        wMargin    = getScalar(margin[1] + margin[3]),
        hMargin    = getScalar(margin[0] + margin[2]),
        wPadding,
        hPadding,
        wSpace,
        hSpace,
        origWidth,
        origHeight,
        origMaxWidth,
        origMaxHeight,
        ratio,
        width_,
        height_,
        maxWidth_,
        maxHeight_,
        iframe,
        body;

      // Reset dimensions so we could re-check actual size
      wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

      wPadding = getScalar(skin.outerWidth(true)  - skin.width());
      hPadding = getScalar(skin.outerHeight(true) - skin.height());

      // Any space between content and viewport (margin, padding, border, title)
      wSpace = wMargin + wPadding;
      hSpace = hMargin + hPadding;

      origWidth  = isPercentage(width)  ? (viewport.w - wSpace) * getScalar(width)  / 100 : width;
      origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

      if (current.type === 'iframe') {
        iframe = current.content;

        if (current.autoHeight && iframe.data('ready') === 1) {
          try {
            if (iframe[0].contentWindow.document.location) {
              inner.width( origWidth ).height(9999);

              body = iframe.contents().find('body');

              if (scrollOut) {
                body.css('overflow-x', 'hidden');
              }

              origHeight = body.outerHeight(true);
            }

          } catch (e) {}
        }

      } else if (current.autoWidth || current.autoHeight) {
        inner.addClass( 'fancybox-tmp' );

        // Set width or height in case we need to calculate only one dimension
        if (!current.autoWidth) {
          inner.width( origWidth );
        }

        if (!current.autoHeight) {
          inner.height( origHeight );
        }

        if (current.autoWidth) {
          origWidth = inner.width();
        }

        if (current.autoHeight) {
          origHeight = inner.height();
        }

        inner.removeClass( 'fancybox-tmp' );
      }

      width  = getScalar( origWidth );
      height = getScalar( origHeight );

      ratio  = origWidth / origHeight;

      // Calculations for the content
      minWidth  = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
      maxWidth  = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

      minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
      maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

      // These will be used to determine if wrap can fit in the viewport
      origMaxWidth  = maxWidth;
      origMaxHeight = maxHeight;

      if (current.fitToView) {
        maxWidth  = Math.min(viewport.w - wSpace, maxWidth);
        maxHeight = Math.min(viewport.h - hSpace, maxHeight);
      }

      maxWidth_  = viewport.w - wMargin;
      maxHeight_ = viewport.h - hMargin;

      if (current.aspectRatio) {
        if (width > maxWidth) {
          width  = maxWidth;
          height = getScalar(width / ratio);
        }

        if (height > maxHeight) {
          height = maxHeight;
          width  = getScalar(height * ratio);
        }

        if (width < minWidth) {
          width  = minWidth;
          height = getScalar(width / ratio);
        }

        if (height < minHeight) {
          height = minHeight;
          width  = getScalar(height * ratio);
        }

      } else {
        width = Math.max(minWidth, Math.min(width, maxWidth));

        if (current.autoHeight && current.type !== 'iframe') {
          inner.width( width );

          height = inner.height();
        }

        height = Math.max(minHeight, Math.min(height, maxHeight));
      }

      // Try to fit inside viewport (including the title)
      if (current.fitToView) {
        inner.width( width ).height( height );

        wrap.width( width + wPadding );

        // Real wrap dimensions
        width_  = wrap.width();
        height_ = wrap.height();

        if (current.aspectRatio) {
          while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
            if (steps++ > 19) {
              break;
            }

            height = Math.max(minHeight, Math.min(maxHeight, height - 10));
            width  = getScalar(height * ratio);

            if (width < minWidth) {
              width  = minWidth;
              height = getScalar(width / ratio);
            }

            if (width > maxWidth) {
              width  = maxWidth;
              height = getScalar(width / ratio);
            }

            inner.width( width ).height( height );

            wrap.width( width + wPadding );

            width_  = wrap.width();
            height_ = wrap.height();
          }

        } else {
          width  = Math.max(minWidth,  Math.min(width,  width  - (width_  - maxWidth_)));
          height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
        }
      }

      if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
        width += scrollOut;
      }

      inner.width( width ).height( height );

      wrap.width( width + wPadding );

      width_  = wrap.width();
      height_ = wrap.height();

      canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
      canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

      $.extend(current, {
        dim : {
          width : getValue( width_ ),
          height  : getValue( height_ )
        },
        origWidth  : origWidth,
        origHeight : origHeight,
        canShrink  : canShrink,
        canExpand  : canExpand,
        wPadding   : wPadding,
        hPadding   : hPadding,
        wrapSpace  : height_ - skin.outerHeight(true),
        skinSpace  : skin.height() - height
      });

      if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
        inner.height('auto');
      }
    },

    _getPosition: function (onlyAbsolute) {
      var current  = F.current,
        viewport = F.getViewport(),
        margin   = current.margin,
        width    = F.wrap.width()  + margin[1] + margin[3],
        height   = F.wrap.height() + margin[0] + margin[2],
        rez      = {
          position: 'absolute',
          top  : margin[0],
          left : margin[3]
        };

      if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
        rez.position = 'fixed';

      } else if (!current.locked) {
        rez.top  += viewport.y;
        rez.left += viewport.x;
      }

      rez.top  = getValue(Math.max(rez.top,  rez.top  + ((viewport.h - height) * current.topRatio)));
      rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width)  * current.leftRatio)));

      return rez;
    },

    _afterZoomIn: function () {
      var current = F.current;

      if (!current) {
        return;
      }

      F.isOpen = F.isOpened = true;

      F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

      F.update();

      // Assign a click event
      if ( current.closeClick || (current.nextClick && F.group.length > 1) ) {
        F.inner.css('cursor', 'pointer').bind('click.fb', function(e) {
          if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
            e.preventDefault();

            F[ current.closeClick ? 'close' : 'next' ]();
          }
        });
      }

      // Create a close button
      if (current.closeBtn) {
        $(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function(e) {
          e.preventDefault();

          F.close();
        });
      }

      // Create navigation arrows
      if (current.arrows && F.group.length > 1) {
        if (current.loop || current.index > 0) {
          $(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
        }

        if (current.loop || current.index < F.group.length - 1) {
          $(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
        }
      }

      F.trigger('afterShow');

      // Stop the slideshow if this is the last item
      if (!current.loop && current.index === current.group.length - 1) {
        F.play( false );

      } else if (F.opts.autoPlay && !F.player.isActive) {
        F.opts.autoPlay = false;

        F.play();
      }
    },

    _afterZoomOut: function ( obj ) {
      obj = obj || F.current;

      $('.fancybox-wrap').trigger('onReset').remove();

      $.extend(F, {
        group  : {},
        opts   : {},
        router : false,
        current   : null,
        isActive  : false,
        isOpened  : false,
        isOpen    : false,
        isClosing : false,
        wrap   : null,
        skin   : null,
        outer  : null,
        inner  : null
      });

      F.trigger('afterClose', obj);
    }
  });

  /*
   *  Default transitions
   */

  F.transitions = {
    getOrigPosition: function () {
      var current  = F.current,
        element  = current.element,
        orig     = current.orig,
        pos      = {},
        width    = 50,
        height   = 50,
        hPadding = current.hPadding,
        wPadding = current.wPadding,
        viewport = F.getViewport();

      if (!orig && current.isDom && element.is(':visible')) {
        orig = element.find('img:first');

        if (!orig.length) {
          orig = element;
        }
      }

      if (isQuery(orig)) {
        pos = orig.offset();

        if (orig.is('img')) {
          width  = orig.outerWidth();
          height = orig.outerHeight();
        }

      } else {
        pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
        pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
      }

      if (F.wrap.css('position') === 'fixed' || current.locked) {
        pos.top  -= viewport.y;
        pos.left -= viewport.x;
      }

      pos = {
        top     : getValue(pos.top  - hPadding * current.topRatio),
        left    : getValue(pos.left - wPadding * current.leftRatio),
        width   : getValue(width  + wPadding),
        height  : getValue(height + hPadding)
      };

      return pos;
    },

    step: function (now, fx) {
      var ratio,
        padding,
        value,
        prop       = fx.prop,
        current    = F.current,
        wrapSpace  = current.wrapSpace,
        skinSpace  = current.skinSpace;

      if (prop === 'width' || prop === 'height') {
        ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

        if (F.isClosing) {
          ratio = 1 - ratio;
        }

        padding = prop === 'width' ? current.wPadding : current.hPadding;
        value   = now - padding;

        F.skin[ prop ](  getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
        F.inner[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) - (skinSpace * ratio) ) );
      }
    },

    zoomIn: function () {
      var current  = F.current,
        startPos = current.pos,
        effect   = current.openEffect,
        elastic  = effect === 'elastic',
        endPos   = $.extend({opacity : 1}, startPos);

      // Remove "position" property that breaks older IE
      delete endPos.position;

      if (elastic) {
        startPos = this.getOrigPosition();

        if (current.openOpacity) {
          startPos.opacity = 0.1;
        }

      } else if (effect === 'fade') {
        startPos.opacity = 0.1;
      }

      F.wrap.css(startPos).animate(endPos, {
        duration : effect === 'none' ? 0 : current.openSpeed,
        easing   : current.openEasing,
        step     : elastic ? this.step : null,
        complete : F._afterZoomIn
      });
    },

    zoomOut: function () {
      var current  = F.current,
        effect   = current.closeEffect,
        elastic  = effect === 'elastic',
        endPos   = {opacity : 0.1};

      if (elastic) {
        endPos = this.getOrigPosition();

        if (current.closeOpacity) {
          endPos.opacity = 0.1;
        }
      }

      F.wrap.animate(endPos, {
        duration : effect === 'none' ? 0 : current.closeSpeed,
        easing   : current.closeEasing,
        step     : elastic ? this.step : null,
        complete : F._afterZoomOut
      });
    },

    changeIn: function () {
      var current   = F.current,
        effect    = current.nextEffect,
        startPos  = current.pos,
        endPos    = { opacity : 1 },
        direction = F.direction,
        distance  = 200,
        field;

      startPos.opacity = 0.1;

      if (effect === 'elastic') {
        field = direction === 'down' || direction === 'up' ? 'top' : 'left';

        if (direction === 'down' || direction === 'right') {
          startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
          endPos[ field ]   = '+=' + distance + 'px';

        } else {
          startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
          endPos[ field ]   = '-=' + distance + 'px';
        }
      }

      // Workaround for http://bugs.jquery.com/ticket/12273
      if (effect === 'none') {
        F._afterZoomIn();

      } else {
        F.wrap.css(startPos).animate(endPos, {
          duration : current.nextSpeed,
          easing   : current.nextEasing,
          complete : F._afterZoomIn
        });
      }
    },

    changeOut: function () {
      var previous  = F.previous,
        effect    = previous.prevEffect,
        endPos    = { opacity : 0.1 },
        direction = F.direction,
        distance  = 200;

      if (effect === 'elastic') {
        endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
      }

      previous.wrap.animate(endPos, {
        duration : effect === 'none' ? 0 : previous.prevSpeed,
        easing   : previous.prevEasing,
        complete : function () {
          $(this).trigger('onReset').remove();
        }
      });
    }
  };

  /*
   *  Overlay helper
   */

  F.helpers.overlay = {
    defaults : {
      closeClick : true,      // if true, fancyBox will be closed when user clicks on the overlay
      speedOut   : 200,       // duration of fadeOut animation
      showEarly  : true,      // indicates if should be opened immediately or wait until the content is ready
      css        : {},        // custom CSS properties
      locked     : !isTouch,  // if true, the content will be locked into overlay
      fixed      : true       // if false, the overlay CSS position property will not be set to "fixed"
    },

    overlay : null,      // current handle
    fixed   : false,     // indicates if the overlay has position "fixed"
    el      : $('html'), // element that contains "the lock"

    // Public methods
    create : function(opts) {
      opts = $.extend({}, this.defaults, opts);

      if (this.overlay) {
        this.close();
      }

      this.overlay = $('<div class="fancybox-overlay"></div>').appendTo( F.coming ? F.coming.parent : opts.parent );
      this.fixed   = false;

      if (opts.fixed && F.defaults.fixed) {
        this.overlay.addClass('fancybox-overlay-fixed');

        this.fixed = true;
      }
    },

    open : function(opts) {
      var that = this;

      opts = $.extend({}, this.defaults, opts);

      if (this.overlay) {
        this.overlay.unbind('.overlay').width('auto').height('auto');

      } else {
        this.create(opts);
      }

      if (!this.fixed) {
        W.bind('resize.overlay', $.proxy( this.update, this) );

        this.update();
      }

      if (opts.closeClick) {
        this.overlay.bind('click.overlay', function(e) {
          if ($(e.target).hasClass('fancybox-overlay')) {
            if (F.isActive) {
              F.close();
            } else {
              that.close();
            }

            return false;
          }
        });
      }

      this.overlay.css( opts.css ).show();
    },

    close : function() {
      var scrollV, scrollH;

      W.unbind('resize.overlay');

      if (this.el.hasClass('fancybox-lock')) {
        $('.fancybox-margin').removeClass('fancybox-margin');

        scrollV = W.scrollTop();
        scrollH = W.scrollLeft();

        this.el.removeClass('fancybox-lock');

        W.scrollTop( scrollV ).scrollLeft( scrollH );
      }

      $('.fancybox-overlay').remove().hide();

      $.extend(this, {
        overlay : null,
        fixed   : false
      });
    },

    // Private, callbacks

    update : function () {
      var width = '100%', offsetWidth;

      // Reset width/height so it will not mess
      this.overlay.width(width).height('100%');

      // jQuery does not return reliable result for IE
      if (IE) {
        offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

        if (D.width() > offsetWidth) {
          width = D.width();
        }

      } else if (D.width() > W.width()) {
        width = D.width();
      }

      this.overlay.width(width).height(D.height());
    },

    // This is where we can manipulate DOM, because later it would cause iframes to reload
    onReady : function (opts, obj) {
      var overlay = this.overlay;

      $('.fancybox-overlay').stop(true, true);

      if (!overlay) {
        this.create(opts);
      }

      if (opts.locked && this.fixed && obj.fixed) {
        if (!overlay) {
          this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
        }

        obj.locked = this.overlay.append( obj.wrap );
        obj.fixed  = false;
      }

      if (opts.showEarly === true) {
        this.beforeShow.apply(this, arguments);
      }
    },

    beforeShow : function(opts, obj) {
      var scrollV, scrollH;

      if (obj.locked) {
        if (this.margin !== false) {
          $('*').filter(function(){
            return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap") );
          }).addClass('fancybox-margin');

          this.el.addClass('fancybox-margin');
        }

        scrollV = W.scrollTop();
        scrollH = W.scrollLeft();

        this.el.addClass('fancybox-lock');

        W.scrollTop( scrollV ).scrollLeft( scrollH );
      }

      this.open(opts);
    },

    onUpdate : function() {
      if (!this.fixed) {
        this.update();
      }
    },

    afterClose: function (opts) {
      // Remove overlay if exists and fancyBox is not opening
      // (e.g., it is not being open using afterClose callback)
      //if (this.overlay && !F.isActive) {
      if (this.overlay && !F.coming) {
        this.overlay.fadeOut(opts.speedOut, $.proxy( this.close, this ));
      }
    }
  };

  /*
   *  Title helper
   */

  F.helpers.title = {
    defaults : {
      type     : 'float', // 'float', 'inside', 'outside' or 'over',
      position : 'bottom' // 'top' or 'bottom'
    },

    beforeShow: function (opts) {
      var current = F.current,
        text    = current.title,
        type    = opts.type,
        title,
        target;

      if ($.isFunction(text)) {
        text = text.call(current.element, current);
      }

      if (!isString(text) || $.trim(text) === '') {
        return;
      }

      title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

      switch (type) {
        case 'inside':
          target = F.skin;
        break;

        case 'outside':
          target = F.wrap;
        break;

        case 'over':
          target = F.inner;
        break;

        default: // 'float'
          target = F.skin;

          title.appendTo('body');

          if (IE) {
            title.width( title.width() );
          }

          title.wrapInner('<span class="child"></span>');

          //Increase bottom margin so this title will also fit into viewport
          F.current.margin[2] += Math.abs( getScalar(title.css('margin-bottom')) );
        break;
      }

      title[ (opts.position === 'top' ? 'prependTo'  : 'appendTo') ](target);
    }
  };

  // jQuery plugin initialization
  $.fn.fancybox = function (options) {
    var index,
      that     = $(this),
      selector = this.selector || '',
      run      = function(e) {
        var what = $(this).blur(), idx = index, relType, relVal;

        if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
          relType = options.groupAttr || 'data-fancybox-group';
          relVal  = what.attr(relType);

          if (!relVal) {
            relType = 'rel';
            relVal  = what.get(0)[ relType ];
          }

          if (relVal && relVal !== '' && relVal !== 'nofollow') {
            what = selector.length ? $(selector) : that;
            what = what.filter('[' + relType + '="' + relVal + '"]');
            idx  = what.index(this);
          }

          options.index = idx;

          // Stop an event from bubbling if everything is fine
          if (F.open(what, options) !== false) {
            e.preventDefault();
          }
        }
      };

    options = options || {};
    index   = options.index || 0;

    if (!selector || options.live === false) {
      that.unbind('click.fb-start').bind('click.fb-start', run);

    } else {
      D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
    }

    this.filter('[data-fancybox-start=1]').trigger('click');

    return this;
  };

  // Tests that need a body at doc ready
  D.ready(function() {
    var w1, w2;

    if ( $.scrollbarWidth === undefined ) {
      // http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
      $.scrollbarWidth = function() {
        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
          child  = parent.children(),
          width  = child.innerWidth() - child.height( 99 ).innerWidth();

        parent.remove();

        return width;
      };
    }

    if ( $.support.fixedPosition === undefined ) {
      $.support.fixedPosition = (function() {
        var elem  = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
          fixed = ( elem[0].offsetTop === 20 || elem[0].offsetTop === 15 );

        elem.remove();

        return fixed;
      }());
    }

    $.extend(F.defaults, {
      scrollbarWidth : $.scrollbarWidth(),
      fixed  : $.support.fixedPosition,
      parent : $('body')
    });

    //Get real width of page scroll-bar
    w1 = $(window).width();

    H.addClass('fancybox-lock-test');

    w2 = $(window).width();

    H.removeClass('fancybox-lock-test');

    $("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
  });

}(window, document, jQuery));