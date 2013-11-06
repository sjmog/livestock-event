App.Order = DS.Model.extend({

  status:DS.attr('string'),

  date: DS.attr('string'),

  user: DS.belongsTo('App.User'),

  booking: DS.belongsTo('App.Booking'),

  amount: DS.attr('number'),

  billingFirstnames: DS.attr('string'),

  billingSurname: DS.attr('string'),

  billingAddress: DS.attr('string'),

  billingCity: DS.attr('string'),

  billingPostcode: DS.attr('string'),

  billingCountry: DS.attr('string'),

  deliveryFirstnames: DS.attr('string'),

  deliverySurname: DS.attr('string'),

  deliveryAddress: DS.attr('string'),

  deliveryCity: DS.attr('string'),

  deliveryPostcode: DS.attr('string'),

  deliveryCountry: DS.attr('string')

});
