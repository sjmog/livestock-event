
  App.UsersShowRoute = Em.Route.extend({
    serialize: function(model) {
      return {
        user_id: model.get('param')
      };
    }
  });

