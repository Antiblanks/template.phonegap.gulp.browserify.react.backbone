/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var DateUtil = function() {
	return {
		DEFAULT_DATETIME_STRING: "0000-00-00 00:00:00",
		DATE_REGEX_DDMMYYYY: /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/,
		DATE_REGEX_DATETIME: /[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/,

		addHoursToDate: function(date, hours) {
			date.setHours(date.getHours()+hours);
			return date;
		},

		minusHoursFromDate: function(date, hours) {
			date.setHours(date.getHours()-hours);
			return date;
		},

		addDaysToDate: function(date, days) {
			date.setDate(date.getDate()+days);
			return date;
		},

		minusDaysFromDate: function(date, days) {
			date.setDate(date.getDate()-days);
			return date;
		},

		getDateWithLeadingZero: function(date) {
			return ('0' + date.getDate()).slice(-2);
		},

		getMonthWithLeadingZero: function(date) {
			return ('0' + (date.getMonth()+1)).slice(-2);
		},

		getHoursWithLeadingZero: function(date) {
			return ('0' + date.getHours()).slice(-2);
		},

		getMinutesWithLeadingZero: function(date) {
			return ('0' + date.getMinutes()).slice(-2);
		},

		getSecondsWithLeadingZero: function(date) {
			return ('0' + date.getSeconds()).slice(-2);
		},

		getDateTimeStringFromDate: function(date) {
			return date.getFullYear() + "-" + this.getMonthWithLeadingZero(date) + "-" + this.getDateWithLeadingZero(date) + " 00:00:00";
		},

		getDateFromDateTimeString: function(dateTimeString) {
			var dateTimeStringParts = dateTimeString.split(" ");
			dateTimeString = dateTimeStringParts[0];
			dateTimeStringParts = dateTimeString.split("-");
			var year = parseInt(dateTimeStringParts[0]);
			var month = parseInt(dateTimeStringParts[1])-1; 
			var day = parseInt(dateTimeStringParts[2]);
			var date = new Date();
			date.setFullYear(year);
			date.setMonth(month);
			date.setDate(day);
			return date;
		},

		getDateFromFacebookBirthdayString: function(facebookBirthdayString) {
			var stringParts = facebookBirthdayString.split("/");
			var month = parseInt(stringParts[0])-1; 
			var day = parseInt(stringParts[1]);
			var year = parseInt(stringParts[2]);
			var date = new Date();
			date.setMonth(month);
			date.setDate(day);
			date.setFullYear(year);
			return date;
		},

		getDateTimeStringFromFacebookBirthdayString: function(facebookBirthdayString) {
			var date = this.getDateFromFacebookBirthdayString(facebookBirthdayString);
			var dateTime = this.getDateTimeStringFromDate(date);
			return dateTime;
		},

		getDateFromUKBirthdayString: function(ukBirthdayString) {
			var stringParts = ukBirthdayString.split("/");
			var day = parseInt(stringParts[0]); 
			var month = parseInt(stringParts[1])-1;
			var year = parseInt(stringParts[2]);
			var date = new Date();
			date.setMonth(month);
			date.setDate(day);
			date.setFullYear(year);
			return date;
		},

		getDateTimeStringFromUKBirthdayString: function(ukBirthdayString) {
			var date = this.getDateFromUKBirthdayString(ukBirthdayString);
			var dateTime = this.getDateTimeStringFromDate(date);
			return dateTime;
		},

		getDDMMYYYYStringFromDate: function(date) {
	        return this.getDateWithLeadingZero(date) + "/" + 
	            this.getMonthWithLeadingZero(date) + "/" + 
	            date.getFullYear();
	    },

		getDDMMYYYYStringFromDateTimeString: function(dateTimeString) {
	        var date = this.getDateFromDateTimeString(dateTimeString);
	    	return this.getDDMMYYYYStringFromDate(date);
	    },

	    getHumanDateStringFromDateTimeString: function(dateTimeString) {
	        var date = this.getDateFromDateTimeString(dateTimeString);
	        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    	var month = date.getMonth();
	    	var day = date.getDate();
	    	var suffix = "th";
	    	if (day == 1 || day == 21 || day == 31) suffix = "st";
	    	if (day == 2 || day == 22) suffix = "nd";
	    	if (day == 3 || day == 23) suffix = "rd";
	    	return months[month] + " " + day + suffix + " " + date.getFullYear();
	    }
	};
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new DateUtil();