App.StaffMember = DS.Model.extend({
	name: DS.attr('string'),
	job: DS.attr('string'),
	image: DS.attr('string'),
	contact: DS.attr('string'),
	description: DS.attr('string'),
	linkedin: DS.attr('string'),
	enabled: DS.attr('string')
});