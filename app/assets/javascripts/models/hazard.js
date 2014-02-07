App.Hazard = DS.Model.extend({
	raform: DS.belongsTo('App.Raform'),
	name: DS.attr('string'),
	persons: DS.attr('string'),
	level: DS.attr('string'),
	rassociation: DS.attr('string'),
	controls: DS.attr('string')
});