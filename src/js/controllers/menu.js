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
var MenuPage 				= require("views/menu/menu-page").View;

// Utils
var DebugUtil               = require("utils/debug").Util;

// Events
var LoginEvent				= require("events/login");

/*************************************
 * Classes
 *************************************/

var MenuController = AppController.extend({
	routes: {
		'': 'menu',
		'menu': 'menu'
	},

	initialize: function(options) {
		DebugUtil.log("MenuController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	},

	menu: function() {
		DebugUtil.log("MenuController", "menu");
		var self = this;
		var menuPage = new MenuPage({
    		state: this.state
    	});
		self.listenTo(menuPage, menuPage.LOGOUT_BUTTON_CLICK, function(logoutRequestObject) {
			global.UsersSessionGateway.logout(function(logoutResponse) {
    			if (!logoutResponse || 
                    !logoutResponse["data"] ||
                    !logoutResponse["data"]["users_session"]) {
    				self.trigger(LoginEvent.ON_LOGOUT_FAILED, {});
					return false;
    			}
    			self.trigger(LoginEvent.ON_LOGOUT_SUCCESS, {});
    			window.location = "#/login";
    			return true;
    		});
		});
    	this.pagesManager.renderPage(menuPage);
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = MenuController;