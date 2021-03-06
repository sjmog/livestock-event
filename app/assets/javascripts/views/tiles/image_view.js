App.ImageView = Ember.View.extend({
	templateName: 'image',
	classNames: ['tile image-tile mix all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 1,
	height: 1,
	currentImage: null,
	nextImage: null,
	flipped:false,
	imgArray: [],
	numberImgs: 6,
	interval: null,
	imgFolder: 'https://res.cloudinary.com/ghost-design/image/upload/',
	moveAlong: function() {
		var self = this;
		var imgNumber = self.numberImgs;
		var randomIndex = Math.floor((Math.random()*imgNumber));
		var randomIndex2 = Math.floor((Math.random()*imgNumber));
		if(randomIndex === randomIndex2) {
			randomIndex2 = Math.floor((Math.random()*imgNumber));
		};
		this.set('nextImage', this.imgArray[randomIndex]);
		this.set('currentImage', this.imgArray[randomIndex + 1]);
	},
	addImgs: function() {
		var self = this;
		var imgArray = self.imgArray;
		var imgFolder = self.imgFolder;
		// For Dropbox, or other sequential naming
		for (var i = 6; i > 0; i--) {
			imgArray.push(imgFolder + 'large' + i + '.jpg');
		};
	},
	didInsertElement: function() {
		var view = this;
		var self = this;
		var imgNumber = self.numberImgs;
		self.addImgs();

		var randomIndex = Math.floor((Math.random()*imgNumber));
		var randomIndex2 = Math.floor((Math.random()*imgNumber));
		if(randomIndex === randomIndex2) {
			randomIndex2 = Math.floor((Math.random()*imgNumber));
		};
		var randomTime = Math.floor((Math.random()*2000 + 1));
		console.log(randomTime);
		view.set('currentImage', view.get('imgArray')[randomIndex]);
		view.set('nextImage', view.get('imgArray')[randomIndex2]);
		//autoRotation
		
			var count = 1;
			var interval = window.requestInterval(function() {
				console.log('rotatingImage');
				if(count % 2) {
					view.set('flipped', true);
				}
				else {
					view.set('flipped', false);
					view.moveAlong();
				};
				if(count<(imgNumber - 1)) {count++} else {count = 0};
			},(18000+randomTime));
			view.set('interval', interval);		
		
	},
	willDestroyElement: function() {
		var view = this;
		var interval = view.get('interval');
		window.clearRequestInterval(interval);
	}
});



