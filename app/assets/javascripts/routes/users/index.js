
  App.UsersIndexRoute = Em.Route.extend({
    model: function() {
      return App.User.find();
    }
  });

