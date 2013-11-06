
  App.User = DS.Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string'),
    password: DS.attr('string'),
    password_confirmation: DS.attr('string'),
    bookings: DS.hasMany('App.Booking'),
    role: DS.attr('string'),
    orders: DS.hasMany('App.Order')
  });
