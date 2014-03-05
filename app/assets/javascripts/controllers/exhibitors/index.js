App.ExhibitorsIndexController = Ember.ArrayController.extend({
	needs: ['application'],
	sortedExhibitors: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('content'), sortProperties: ['name'], sortAscending: true }
	 	);
	    return sortedResult;
	}.property('content.@each'),
	init:function() {
		this._super();
	},
	actions: {
		toggleFilters: function() {
			if(this.get('filters')) {
				this.set('filters', false);
			} else {
				this.set('filters', true);
			}
		},
		allOn: function() {
			this.set('isHealth', true);
			this.set('isBusiness', true);
			this.set('isRenewables', true);
			this.set('isFeeds', true);
			this.set('isGenetics', true);
			this.set('isStorage', true);
			this.set('isEquipment', true);
			this.set('isMilking', true);
			this.set('isMilkmade', true);
			this.set('isIrrigation', true);
			this.set('isPig', true);
		},
		allOff: function() {
			this.set('isHealth', false);
			this.set('isBusiness', false);
			this.set('isRenewables', false);
			this.set('isFeeds', false);
			this.set('isGenetics', false);
			this.set('isStorage', false);
			this.set('isEquipment', false);
			this.set('isMilking', false);
			this.set('isMilkmade', false);
			this.set('isIrrigation', false);
			this.set('isPig', false);
		}
	},
	showAreas: [
	  {fullName: "Please Select...", value: ''},
		{fullName: "Indoor", value: 'indoor'},
		{fullName: "Outdoor", value: 'outdoor'},
		{fullName: "Machinery Hall", value: 'machinery hall'},
		{fullName: "Livestock Hall", value: 'livestock hall'}
	],
	selectedArea: null,
	isHealth: true,
	isBusiness: true,
	isRenewables: true,
	isFeeds: true,
	isGenetics: true,
	isStorage: true,
	isEquipment: true,
	isMilking: true,
	isMilkmade: true,
	isIrrigation: true,
	isPig: true,

	filters:false,

	isAll: function() {
		return this.get('isHealth') && this.get('isBusiness') && this.get('isRenewables') && this.get('isFeeds') && this.get('isGenetics') && this.get('isStorage') && this.get('isEquipment') && this.get('isMilking') && this.get('isMilkmade') && this.get('isIrrigation');
	}.property('isPig', 'isStorage', 'isEquipment', 'isMilking', 'isMilkmade', 'isIrrigation', 'isBusiness', 'isHealth', 'isRenewables', 'isFeeds', 'isGenetics'),

	isNone: function() {
		return !(this.get('isHealth') || this.get('isBusiness') || this.get('isRenewables') || this.get('isFeeds') || this.get('isGenetics') || this.get('isStorage') || this.get('isEquipment') || this.get('isMilking') || this.get('isMilkmade') || this.get('isIrrigation'));
	}.property('isPig', 'isStorage', 'isEquipment', 'isMilking', 'isMilkmade', 'isIrrigation', 'isBusiness', 'isHealth', 'isRenewables', 'isFeeds', 'isGenetics'),

	selectedAreaDidChange: function() {
		var selectedArea = this.get('selectedArea');
		if (selectedArea !== 'indoor') {
			this.set('isHealth', false);
			this.set('isBusiness', false);
			this.set('isRenewables', false);
			this.set('isFeeds', false);
			this.set('isGenetics', false);
			this.set('isStorage', false);
			this.set('isEquipment', false);
			this.set('isMilking', false);
			this.set('isMilkmade', false);
			this.set('isIrrigation', false);
			this.set('isPig', false);
		} else {
			this.set('isHealth', true);
			this.set('isBusiness', true);
			this.set('isRenewables', true);
			this.set('isFeeds', true);
			this.set('isGenetics', true);
			this.set('isStorage', true);
			this.set('isEquipment', true);
			this.set('isMilking', true);
			this.set('isMilkmade', true);
			this.set('isIrrigation', true);
			this.set('isPig', true);
		};
	}.property('selectedArea'),

	isIndoor: function() {
		return this.get('selectedArea') === 'indoor';
	}.property('selectedArea'),


	isOutdoor: function() {
		return this.get('selectedArea') === 'outdoor';
	}.property('selectedArea'),

	isMachinery: function() {
		return this.get('selectedArea') === 'machinery hall';
	}.property('selectedArea'),

	isLivestock:function() {
		return this.get('selectedArea') === 'livestock hall';
	}.property('selectedArea'),


	filteredExhibs: function() {
		var isIndoor = this.get('isIndoor'),
			isOutdoor = this.get('isOutdoor'),
			isMachinery = this.get('isMachinery'),
			isLivestock = this.get('isLivestock'),
			isHealth = this.get('isHealth'),
			isBusiness = this.get('isBusiness'),
			isRenewables = this.get('isRenewables'),
			isFeeds = this.get('isFeeds'),
			isGenetics = this.get('isGenetics'),
			isStorage = this.get('isStorage'),
			isEquipment = this.get('isEquipment'),
			isMilking = this.get('isMilking'),
			isMilkmade = this.get('isMilkmade'),
			isIrrigation = this.get('isIrrigation');
			isPig = this.get('isPig');
		return this.get('sortedExhibitors').filter(function(item) {
			if (!item.get('list')) {
				return false; }
			else {
				if (isIndoor) {
					if(item.get('area') !== "indoor") {
						return false;
					} else {console.log('indoor filter not activated');}
				};
				if (isOutdoor) {
					if(item.get('area') !== "outdoor") {
						return false;
					} else {return true;}
				};
				if (isMachinery) {
					if(item.get('area') !== "machinery hall") {
						return false;
					} else {return true;}
				};
				if (isLivestock) {
					if(item.get('area') !== "livestock hall") {
						return false;
					} else {return true;}
				};
				if (isHealth) {
					if(item.get('zone') === "animal health") {
						return true;
					} else {console.log('nope');}
				};
				if (isBusiness) {
					if(item.get('zone') === "business management") {
						return true;
					} else {console.log('nope');}
				};
				if (isRenewables) {
					if(item.get('zone') === "diversifarm and renewables") {
						return true;
					} else {console.log('nope');}
				};
				if (isFeeds) {
					if(item.get('zone') === "feeds and forage") {
						return true;
					} else {console.log('nope');}
				};
				if (isGenetics) {
					if(item.get('zone') === "genetics") {
						return true;
					} else {console.log('nope');}
				};
				if (isStorage) {
					if(item.get('zone') === "housing and storage") {
						return true;
					} else {console.log('nope');}
				};
				if (isEquipment) {
					if(item.get('zone') === "livestock equipment and machinery") {
						return true;
					} else {console.log('nope');}
				};
				if (isMilking) {
					if(item.get('zone') === "milking") {
						return true;
					} else {console.log('nope');}
				};
				if (isMilkmade) {
					if(item.get('zone') === "milkmade") {
						return true;
					} else {console.log('nope');}
				};
				if (isIrrigation) {
					if(item.get('zone') === "slurry, muck and irrigation") {
						return true;
					} else {console.log('nope');}
				};
				if (isPig) {
					if(item.get('zone') === "pig and poultry") {
						return true;
					} else {console.log('nope');}
				};
			};
			
		});
	}.property('selectedArea', 'sortedExhibitors.@each', 'isPig', 'isStorage', 'isEquipment', 'isMilking', 'isMilkmade', 'isIrrigation', 'isBusiness', 'isHealth', 'isRenewables', 'isFeeds', 'isGenetics'),
});
