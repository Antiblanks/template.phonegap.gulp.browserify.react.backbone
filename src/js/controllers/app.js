/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var BackboneController		= require("backbone.controller");
var React                   = require("react");

// Events
var AppEvent				= require("events/page");

// Utils
var DebugUtil               = require("utils/debug").Util;
var ConnectionUtil          = require("utils/connection").Util;

/*************************************
 * Classes
 *************************************/

var AppController = Backbone.Controller.extend({
	initialize: function(options) {
		DebugUtil.log("AppController", "initialize", options);

		var self = this;
		this.router = options.router;
		this.pagesManager = options.pagesManager;
		this.state = options.state;
		this.checkReadyTimer = null;
		this.headerModel = null;
		this.footerModel = null;

		$(ConnectionUtil).bind(ConnectionUtil.ON_CONNECTED, function() {
			self.reloadRoute();
		});
	},

	isControllerReady: function() {
		DebugUtil.log("AppController", "isControllerReady");
		return true;
	},

	isUserLoggedIn: function() {
		DebugUtil.log("AppController", "isUserLoggedIn", this.state, this.state.getLoggedInUser());
		return this.state.getLoggedInUser() !== null;
	},

	onBeforeRoute: function() {
		var self = this;
		var deferred = $.Deferred();
		var deferredCount = 0;
		var deferredMaxCount = 600; // @note: One minute
		var params = arguments && arguments.length != 0
			? arguments[arguments.length-1] : {};
		var page = arguments && arguments.length != 0 ? arguments[0] : null;

		DebugUtil.log("AppController", "onBeforeRoute", page);

		// Check if connection is hot, if not bounce to not connected page
		if (!ConnectionUtil.isDeviceConnected() && page != "not-connected") {
			var onConnectPath = window.location.hash;
			if (!onConnectPath || onConnectPath.length == 0)
				onConnectPath = "#/";
			if (onConnectPath.indexOf("/") != 0)
				onConnectPath = "/"+onConnectPath;
			window.location = "/#/not-connected?onConnectPath="+encodeURIComponent(onConnectPath);
			return false;
		}
		
		// Check if user is logged in, if not bounce to login page
		if (ConnectionUtil.isDeviceConnected() && !this.isUserLoggedIn() && page != "login") {
			// @todo: Handle non-accessible redirects here...
			/*if (page == "example/:exampleId") {
				if (arguments[1]) {
					var redirectPath = 
						page.replace(":exampleId", arguments[1]);
					window.location = "/#/login?redirectPath="+redirectPath;
				}
				return false;
			}*/
			window.location = "/#/login";
			return false;
		}

		// App ready
		if (this.checkReadyTimer)
			window.clearInterval(this.checkReadyTimer);
		this.checkReadyTimer = window.setInterval(function() {
			if (deferredCount >= deferredMaxCount) {
				window.clearInterval(self.checkReadyTimer);
				DebugUtil.log("AppController >> ERROR: onBeforeRoute(); Exiting code due to request timeout");
			}
			DebugUtil.log("AppController", "self.router.isAppReady()", self.router.isAppReady());
			if (self.router.isAppReady()) {
				window.clearInterval(self.checkReadyTimer);
				self.pagesManager.updatePageHistoryState();
				self.trigger(AppEvent.ON_BEFORE_ROUTE, {
					"params": params,
					"page" : page
				});
				deferred.resolve();
			}
			deferredCount++;
		}, 100);

		return deferred.promise();
	},

	onAfterRoute: function() {
		DebugUtil.log("AppController", "onAfterRoute");

		var params = arguments && arguments.length != 0
			? arguments[arguments.length-1] : {};
		this.trigger(AppEvent.ON_AFTER_ROUTE, {
			"params": params
		});
	},

	reloadRoute: function() {
		DebugUtil.log("AppController", "reloadRoute");
		// @todo: Complete logic here...
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = AppController;