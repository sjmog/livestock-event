App.Article = DS.Model.extend({

	image:DS.attr('string'),

  title: DS.attr('string'),

  author: DS.attr('string'),

  published: DS.attr('date'),

  articleContent: DS.attr('string'),

  day: function() {
    if(this.get('published')) {
    	return this.get('published').getDate();
    }
    else {return null};
  }.property('published'),

  monthNumber: function() {
    if(this.get('published')) {
  	 return (this.get('published').getMonth() + 1);
    } else {return null};
  }.property('published'),

  year: function() {
    if(this.get('published')) {
      return (this.get('published').getFullYear());
    } else {return null};
  }.property('published'),

  shortYear: function() {
    var year = this.get('year');
    return String(year).substring(2,4);
  }.property('year'),

  month: function() {
  	var monthNumber = this.get('monthNumber');
  	switch(monthNumber) {
  	  case 1:
  	    return 'Jan'
  	    break;
  	 case 2:
  	   return 'Feb'
  	   break;
  	 case 3:
  	   return 'Mar'
  	   break;
  	 case 4:
  	   return 'Apr'
  	   break;
  	 case 5:
  	   return 'May'
  	   break;
  	 case 6:
  	   return 'Jun'
  	   break;
  	 case 7:
  	   return 'Jul'
  	   break;
  	 case 8:
  	   return 'Aug'
  	   break;
  	 case 9:
  	   return 'Sep'
  	   break;
  	 case 10:
  	   return 'Oct'
  	   break;
  	 case 11:
  	   return 'Nov'
  	   break;
  	 case 12:
  	   return 'Dec'
  	   break;
  	}
  }.property('monthNumber'),

  fullMonth: function() {
  	var monthNumber = this.get('monthNumber');
  	switch(monthNumber) {
  	  case 1:
  	    return 'January'
  	    break;
  	 case 2:
  	   return 'February'
  	   break;
  	 case 3:
  	   return 'March'
  	   break;
  	 case 4:
  	   return 'April'
  	   break;
  	 case 5:
  	   return 'May'
  	   break;
  	 case 6:
  	   return 'June'
  	   break;
  	 case 7:
  	   return 'July'
  	   break;
  	 case 8:
  	   return 'August'
  	   break;
  	 case 9:
  	   return 'September'
  	   break;
  	 case 10:
  	   return 'October'
  	   break;
  	 case 11:
  	   return 'November'
  	   break;
  	 case 12:
  	   return 'December'
  	   break;
  	}
  }.property('monthNumber'),

  year: function() {
    if(this.get('published')) {
  	 return this.get('published').getFullYear();
    } else {return null};
  }.property('published'),

});


