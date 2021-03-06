App.ImagehalfView = Ember.View.extend({
	templateName: 'image',
	classNames: ['tile image-tile mix all tile-half-tall tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 1,
	height: 0.5,
	currentImage: null,
	nextImage: null,
	flipped:false,
	imgArray: [],
	numberImgs: 28,
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
		var numberImgs = self.numberImgs;
		for (var i = numberImgs; i > 0; i--) {
			imgArray.push(imgFolder + 'small' + i + '.jpg');
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
		$(document).ready(function() {
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
		})
	},
	willDestroyElement: function() {
		var view = this;
		var interval = view.get('interval');
		window.clearRequestInterval(interval);
	}
});



