App.Stand = DS.Model.extend({

  number:DS.attr('string'),

  taken: DS.attr('boolean'),

  frontage: DS.attr('number'),

  depth: DS.attr('number'),

  area: DS.attr('string'),

  booking: DS.belongsTo('App.Booking'),

  zone: DS.attr('string')

});

