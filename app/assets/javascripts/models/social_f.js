App.SocialF = DS.Model.extend({

  user: DS.attr('string'),

  text: DS.attr('string'),

  published: DS.attr('string'),

  link: DS.attr('string'),

  likes: DS.attr('number'),

  day: DS.attr('string'),

  month: DS.attr('string')

});
