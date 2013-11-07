App.HalfTile = DS.Model.extend({

	//Does the tile have a tile-title?
	tileTitle: DS.attr('boolean'),

	//Does the tile have the option to go 'back'?
	backButton: DS.attr('boolean'),
		//if so, where does the tile go 'back' to?
		backPath: DS.attr('string'),

	//What is the tile's title?
	title: DS.attr('string'),

	//Does the tile flip over?
	flipTile: DS.attr('boolean'),
		//if so, does the reverse have a tile-title?
		backTileTitle: DS.attr('boolean'),
			//if so, what is the reverse's title?
			backTitle: DS.attr('string'),

	//Does the tile contain special HTML (it will not be escaped)?
	contentTile: DS.attr('boolean'),
		//if so, what is the HTML?
		content: DS.attr('string'),

	//Is the tile solely for holding buttons (2 or 4)?
	buttonTile: DS.attr('boolean'),
		//if so, what are the button icons -
		button1Icon: DS.attr('string'),
		button2Icon: DS.attr('string'),
		button3Icon: DS.attr('string'),
		button4Icon: DS.attr('string'),
		// - where does each lead (as an Ember path for a link-to helper) -
		button1Link: DS.attr('string'),
		button2Link: DS.attr('string'),
		button3Link: DS.attr('string'),
		button4Link: DS.attr('string'),
		// - and what is the button label for each?
		button1Text: DS.attr('string'),
		button2Text: DS.attr('string'),
		button3Text: DS.attr('string'),
		button4Text: DS.attr('string'),
		
});