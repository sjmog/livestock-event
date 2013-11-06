(function ( $ ) {

$.fn.slideAlong = function() {
	var allSlides = $(this).find('.one-slide');
	var index = 0;
	setTimeout(function() {
		allSlides.removeClass('current');
		allSlides.get(index).addClass('current');
		if(index <= allSlides.length()) {index ++}
		else {$(this).restartSliding()};
	}, 9000);
};

//restart it

$.fn.restartSliding = function() {
	window.clearTimeout(allSlides);
	slideAlong();
};

}( jQuery ));