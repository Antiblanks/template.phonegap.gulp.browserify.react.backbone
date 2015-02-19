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
var HomePage 				= require("views/home/home-page").View;

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var HomeController = AppController.extend({
	routes: {
		'home': 'home',
		'info': 'info'
	},

	initialize: function(options) {
		DebugUtil.log("HomeController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	},

	home: function() {
		DebugUtil.log("HomeController", "home", this.pagesManager);
		var self = this;
		this.state.loadLoggedInUserContactByNameCollectionPage(1);
    	this.pagesManager.renderPage(new HomePage({
    		state: this.state
    	}));
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = HomeController;