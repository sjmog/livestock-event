Ember.TEMPLATES.application=Ember.Handlebars.compile('<div id="st-container" class="st-container st-effect-2">\n  	<nav class="st-menu st-effect-2" id="menu-2">\n  		{{#unless isAuthenticated}}\n  		<h2 class="">LOG IN</h2>\n  		{{else}}\n  		<h2 class="">Quick Links</h2>\n  		{{/unless}}\n  		{{#unless isAuthenticated}}\n  		<div class="row">\n  			<div class="small-12 columns">\n  				{{view App.AuthView }}\n  			</div>\n  		</div>\n  		{{else}}\n  		<ul>\n  			<li>\n  				{{#link-to \'users.show\' currentUser}}My Account{{/link-to}}\n  			</li>\n  			<li>\n  				{{#link-to \'bookings.index\'}}My Bookings{{/link-to}}\n  			</li>\n  			<li>\n  				{{#link-to \'orders.index\'}}My Payments{{/link-to}}\n  			</li>\n  			<li>\n  				<a {{action \'logout\'}}>Log Out</a>\n  			</li>\n  		</ul>\n  		{{/unless}}\n  		<div class="row">\n  		  <div class="small-12 columns" style="text-align:center;">\n  		    <a style="line-height: 1.2em;" href="https://dl.dropboxusercontent.com/u/57653232/Hosted%20files%20for%20RABDF%20DO%20NOT%20DELETE/forms/public/Compulsory%20and%20Additional%20Forms.zip" class="inlineLink">Compulsory &amp; Additional Forms</a>\n  		  </div>\n  		</div>\n  	</nav>\n  	<div id="pusherContainer" class="st-pusher">\n  		<div id="pageContainer" class="st-content">\n  			\n  				<div class="container">\n  					{{view App.HeaderView}}\n  					\n  					{{outlet}}\n  \n  					{{#if isInnerPage}}\n  						\n  					<div class="sidebarHolder">\n  						{{render sidebar}}\n  					</div>\n  \n  					{{/if}}\n  						\n  					{{view App.FooterView}}\n  				</div>\n  			\n  		</div>\n  	</div>\n  </div>');