App.ContactView = Ember.View.extend({
	templateName: 'contact',
	classNames: ['tile content-tile tab-tile contact mix visitor exhibitor general_info all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 9,
	exhibitorImportance: 8,
	generalImportance: 9,
	width: 1,
	height: 1,
	didInsertElement: function() {
		//carouTabs code
		var $view = this.$();
		var $carous = $view.find('.carouTabs'); //all carousels in each carouTabs containers, which may be nested
		for (var i = 0; i < $carous.length; i++) {
			var $item = $($carous[i]);
			$item.children('.carouTab:first-of-type').addClass('activeCarou');
			$item.find('.carouTabTitle').click(function() {
				var $parent = $(this).parent('.carouTab');
			$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
		});
		};
      	$('#contactMessage').focus(function() {
      		if ($('#yourName').val() && $('#yourEmail').val()) {
          		$('.inputRow').animo({animation:'fadeOutUp', duration:0.5, keep: true}, function() {
          			$('.holderRow').animo({animation: 'fadeInUp', duration:0.5, keep: true});
          			$('.sendRow').animo({animation:'fadeInUp', duration:0.5, keep: true}).animate({top: '-90px'}, 500, function() {});
          			$('.messageRow').animate({top: '-90px'}, 500, function() {});
          		})
          		$('#yourNameHolder').html($('#yourName').val());
          		$('#yourEmailHolder').html($('#yourEmail').val());
          		
      		}
      	});

      	$('.valueHolder').click(function() {
      		$('.holderRow').fadeOut();
			$('.inputRow').fadeIn();
      	});
      	//for the flipping
      	$('#sendButton').click(function() {
      		$('.tile.contact .front').addClass('flipped');
      		$('.tile.contact .back').addClass('flipped');
      	});
		                  
	}
});


