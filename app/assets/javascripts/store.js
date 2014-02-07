App.Adapter = DS.RESTAdapter.create({url: '/api'});

// App.Adapter.map('App.Question', { answers: {embedded: 'always'} });

App.Store = DS.Store.extend({
revision: 11,
adapter: App.Adapter
});


