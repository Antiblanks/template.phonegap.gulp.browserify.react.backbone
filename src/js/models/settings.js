/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;

/*************************************
 * Classes
 *************************************/

var SettingsModel = Backbone.Model.extend({
    initialize: function() {},
    defaults : {
        "user_id": 0,
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Model = SettingsModel;