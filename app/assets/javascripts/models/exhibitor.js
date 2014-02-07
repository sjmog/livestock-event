App.Exhibitor = DS.Model.extend({

	name:DS.attr('string'),

	email:DS.attr('string'),

  	telephone: DS.attr('string'),

  	website: DS.attr('string'),

  	area: DS.attr('string'),

  	zone: DS.attr('string'),

  	description: DS.attr('string'),

  	parsedArea: function() {
  	  return this.get('area').replace(/ /g,'');
  	}.property('area'),

  	parsedZone: function() {
  	  return this.get('zone').replace(/ /g,'');
  	}.property('zone'),

    shortArea: function() {
      var area = this.get('area');
      var shortArea;
      switch(area){
        case "indoor":
          shortArea = "indoor";
          break
        case "outdoor":
          shortArea = "outdoor";
          break
        case "machinery hall":
          shortArea = "mach. hall";
          break
        case "livestock hall":
          shortArea = "livestock";
          break;
      }
      return shortArea;
    }.property('area'),

    shortZone: function() {
      var zone = this.get('zone');
      var shortZone;
      switch(zone){
        case "animal health":
          shortZone = "health";
          break
        case "business management":
          shortZone = "business";
          break
        case "diversifarm and renewables":
          shortZone = "renewables";
          break
        case "feeds and forage":
          shortZone = "feeds";
          break;
        case "genetics":
          shortZone = "genetics";
          break;
        case "housing and storage":
          shortZone = "storage";
          break;
        case "livestock equipment and machinery":
          shortZone = "equipment";
          break;
        case "milking":
          shortZone = "milking";
          break;
        case "milkmade":
          shortZone = "milkmade";
          break;
        case "slurry, muck and irrigation":
          shortZone = "irrigation";
          break;
      }
      return shortZone;
    }.property('zone')

});