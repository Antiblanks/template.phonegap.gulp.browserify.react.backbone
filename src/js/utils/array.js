/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var ArrayUtil = function() {
	return {
		searchForObjectWithPropertyInArray: function(theArray, propertyName, propertyValue) {
		    for (i = 0; i < theArray.length; i++) {
		        if (theArray[i][propertyName] == propertyValue) {
		            return theArray[i]
		        }
		    }
		    return null;
		},

		isArray: function(value) {
			return Object.prototype.toString.call(value) === '[object Array]';
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

exports.Util = new ArrayUtil();