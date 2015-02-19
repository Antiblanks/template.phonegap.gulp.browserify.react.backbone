/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react"); 

// Controller
var AppController 			= require("controllers/app").Controller;

// View
// @todo: Add views here...

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var UserController = AppController.extend({
	routes: {},

	initialize: function(options) {
		DebugUtil.log("UserController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = UserController;