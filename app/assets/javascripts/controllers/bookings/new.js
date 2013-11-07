

// inherit from edit controller
App.BookingsNewController = App.BookingsEditController.extend({
	init: function() {
		this._super();
		//console.log('controller init');
		this.set('stands', App.Stand.find());

	},
	setup:function() {
		console.log('controller setup');
		var self = this;
		//console.log(self.content); //should be same as model from Route
		//console.log(self.get('content.standNumber'));
		
		self.stands = App.Stand.find();
		self.set('content.standNumber', 0);
		self.set('standWarning', false);
		this.set('userHasEnteredData', true);
		//console.log(self.standNumber); //controller decoration, bound to input
		//console.log(self.get('standNumber')); //should be same as line above
		//console.log(self.get('content.standNumber')); //model, unbound
		Ember.run.later(this, function() {
			var user = this.controllerFor('application').get('currentUser');
			console.log(user);
			self.set('content.user', user);
		}, 2000)
	},
	save: function(booking) {
	  var currentStand = this.get('stand');
	  
	  if (currentStand !== null) {
	  	var standArea = currentStand.get('area');
	  	if (standArea !== 'indoor') {
	  		currentStand.set('taken', true);
	  	}
	  }
	  //console.log(currentUser);
	  booking.one('didCreate', this, function(){
	    this.transitionToRoute('bookings.show', booking);
	  });
	  this.get('store').commit();
	},
	userHasEnteredData:null,
	span: null,
	stands: null,
	standWarning: null,
	standGood: null,
	areaTooSmall: function() {
		if (this.get('content.area') < 9) {
			return true;
		} else {
			return false;
		};
	}.property('content.area'),
	getStand: function() {
		//console.log('getStand called');
	  var value = this.get('content.standNumber');
	  var stand = this.stands.filterBy('number', value)[0];
      if(stand) {

        if (stand.get('taken') === true) {
        	console.log('stand number ' + value + ' is taken');
        	this.set('standGood', false);
        	this.set('standWarning', true);
        	if (standArea === 'outdoor' || 'machinery hall') {
        		$('#frontage').prop('disabled', true);
        		$('#depth').prop('disabled', true);
        	} else {
        		$('#frontage').prop('disabled', false);
        		$('#depth').prop('disabled', false);
        	}
         // console.log(stand);
         // console.log(stand.get('number'));
        }
        else {
         // console.log('stand number ' + value + ' is not taken');
        //  console.log(stand);
        //  console.log(stand.get('number'));
          this.set('content.stand', stand);
          this.set('content.frontage', stand.get('frontage'));
          this.set('content.depth', stand.get('depth'));
          this.set('content.showArea', stand.get('area'));
          this.set('standWarning', false);
          this.set('standGood', true);
          var standArea = stand.get('area');
          if (standArea === 'outdoor' || 'machinery hall') {
          	$('#frontage').prop('disabled', true);
          	$('#depth').prop('disabled', true);
          } else {
          	$('#frontage').prop('disabled', false);
          	$('#depth').prop('disabled', false);
          }
          return stand;

        }
      }
      else {
        console.log('stand ' + value + ' does not exist');
        this.set('standGood', false);
        this.set('standWarning', true);
        if (standArea === 'outdoor' || 'machinery hall') {
                  	$('#frontage').prop('disabled', true);
                  	$('#depth').prop('disabled', true);
                  } else {
                  	$('#frontage').prop('disabled', false);
                  	$('#depth').prop('disabled', false);
                  }
      };
	},

	isSameAs2013: function() {
		return this.get('content.sameAs2013');
	}.property('content.sameAs2013'),

	isNotSameAs2013: function() {
		return !(this.get('content.sameAs2013'));
	}.property('content.sameAs2013'),

	isLivestockHall: function() {
		if(this.get('content.showArea') === 'livestock hall') {
			this.set('content.standType', 'clear');
			this.set('content.position', 'standard');
			this.set('content.zone', '');
			$("#zone").prop('disabled', true);
			$("#stand_type").prop('disabled', true);
			$("#position").prop('disabled', true);
		}

		return this.get('content.showArea') === 'livestock hall';
	}.property('content.showArea'),

	isIndoor: function() {
		if(this.get('content.showArea') === 'indoor') {
			$("#zone").prop('disabled', false);
			$("#stand_type").prop('disabled', false);
			$("#position").prop('disabled', false);
		}
		return this.get('content.showArea') === 'indoor';
	}.property('content.showArea'),

	isOutdoor: function() {
		if(this.get('content.showArea') === 'outdoor') {
			this.set('content.standType', 'clear');
			this.set('content.position', 'standard');
			this.set('content.zone', '');
				$("#zone").prop('disabled', true);
				$("#stand_type").prop('disabled', true);
				$("#position").prop('disabled', true);

		};
		
		return this.get('content.showArea') === 'outdoor';
	}.property('content.showArea'),

	isMachineryHall: function() {
		if(this.get('content.showArea') === 'machinery hall') {
			this.set('content.standType', 'clear');
			this.set('content.position', 'standard');
			this.set('content.zone', '');
				$("#zone").prop('disabled', true);
				$("#stand_type").prop('disabled', true);
				$("#position").prop('disabled', true);

		};

		return this.get('content.showArea') === 'machinery hall';
	}.property('content.showArea'),

	standTypeIsClear: function() {
	  return this.get('content.standType') === 'clear';
	}.property('content.standType'),

	standTypeIsShell: function() {
		if(this.get('content.standType') === 'modular') {
			return true;
		};
		
	}.property('content.standType'),

	standTypeIsNotShell: function() {
		if(this.get('content.standType') === 'modular') {
			return false;
		};
	}.property('content.standType'),

	positionIsStandard: function() {
	  return this.get('content.position') === 'standard';
	}.property('content.position'),

	positionIsCorner: function() {
	  return this.get('content.position') === 'corner';
	}.property('content.position'),

	positionIsPeninsula: function() {
	  return this.get('content.position') === 'peninsula';
	}.property('content.position'),

	positionIsIsland: function() {
	  return this.get('content.position') === 'island';
	}.property('content.position'),

	zoneIsAnimalhealth: function() {
	  if(this.get('content.zone') === 'animal health') {
	  	this.set('colorClass', 'animalColor');
	  };
	  return this.get('content.zone') === 'animal health';
	}.property('content.zone'),

	zoneIsBusinessmanagement: function() {
		if(this.get('content.zone') === 'business management') {
		this.set('colorClass', 'businessColor');
	};
	  return this.get('content.zone') === 'business management';
	}.property('content.zone'),

	zoneIsDiversifarmrenewables: function() {
		if(this.get('content.zone') === 'diversifarm and renewables') {
	  this.set('colorClass', 'diversifarmColor');
	};
	  return this.get('content.zone') === 'diversifarm and renewables';
	}.property('content.zone'),

	zoneIsFeedsforage: function() {
		if(this.get('content.zone') === 'feeds and forage') {
	  this.set('colorClass', 'feedsColor');
	};
	  return this.get('content.zone') === 'feeds and forage';
	}.property('content.zone'),

	zoneIsGenetics: function() {
		if(this.get('content.zone') === 'genetics') {
	  this.set('colorClass', 'geneticsColor');
	};
	  return this.get('content.zone') === 'genetics';
	}.property('content.zone'),

	zoneIsHousingstorage: function() {
		if(this.get('content.zone') === 'housing and storage') {
	  this.set('colorClass', 'housingColor');
	};
	  return this.get('content.zone') === 'housing and storage';
	}.property('content.zone'),

	zoneIsLivestockequipment: function() {
		if(this.get('content.zone') === 'livestock equipment and machinery') {
	  this.set('colorClass', 'livestockColor');
	};
	  return this.get('content.zone') === 'livestock equipment and machinery';
	}.property('content.zone'),

	zoneIsMilking: function() {
		if(this.get('content.zone') === 'milking') {
	  this.set('colorClass', 'milkingColor');
	};
	  return this.get('content.zone') === 'milking';
	}.property('content.zone'),

	zoneIsMilkmade: function() {
		if(this.get('content.zone') === 'milkmade') {
	  this.set('colorClass', 'milkmadeColor');
	};
	  return this.get('content.zone') === 'milkmade';
	}.property('content.zone'),

	zoneIsSlurrymuck: function() {
		if(this.get('content.zone') === 'slurry, muck and irrigation') {
	  this.set('colorClass', 'slurryColor');
	};
	  return this.get('content.zone') === 'slurry, muck and irrigation';
	}.property('content.zone'),

	breedIsDairy: function() {
		return this.get('content.breedSociety') === 'dairy';
	}.property('content.breedSociety'),

	colorClass: null,

});


