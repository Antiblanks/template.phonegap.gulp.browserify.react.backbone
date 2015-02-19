/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;

// Utils
var DateUtil                = require("utils/date").Util;

/*************************************
 * Classes
 *************************************/

var UserModel = Backbone.Model.extend({
    initialize: function() {},
    defaults : {
        "facebook_user_id": "",
        "facebook_auth_token": "",
    	"first_name": "",
        "last_name": "",
        "full_name": "",
        "date_of_birth": "",
        "date_created": "",
        "email": "",
        "gender": "",
        "phone": ""
    },

    getDateOfBirthString: function() {
        if (this.get("date_of_birth") == DateUtil.DEFAULT_DATETIME_STRING)
            return "";
        var date = new Date(String(this.get("date_of_birth")).replace(/-/g,"/"));
    	return DateUtil.getDateWithLeadingZero(date) + "/" + 
            DateUtil.getMonthWithLeadingZero(date) + "/" + 
            date.getFullYear();
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Model = UserModel;