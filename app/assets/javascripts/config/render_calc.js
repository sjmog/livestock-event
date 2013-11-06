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