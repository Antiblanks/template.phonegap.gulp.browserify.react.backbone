/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;

// Utils
var DebugUtil               = require("utils/debug").Util;

// Models
var UserModel               = require("models/user").Model; 

/*************************************
 * Classes
 *************************************/

var UsersSessionModel = Backbone.Model.extend({
    initialize: function() {
        DebugUtil.log("UsersSessionModel", "initialize");
        this.set({
             "user": new UserModel(this.get("user"))
        });
    },

    defaults : {
        "session_id": "",
        "user_id": 0,
        "ip_address": "",
        "expiry_date": "",
        "user": new UserModel()
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Model = UsersSessionModel;