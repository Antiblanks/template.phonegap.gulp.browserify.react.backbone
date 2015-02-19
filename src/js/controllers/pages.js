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
var NotConnectedPage 		= require("views/pages/not-connected-page").View;

// Utils
var DebugUtil               = require("utils/debug").Util;
var UrlUtil               	= require("utils/url").Util;
var ConnectionUtil         	= require("utils/connection").Util;

/*************************************
 * Classes
 *************************************/

var PagesController = AppController.extend({
	routes: {
		'not-connected': 'notConnected'
	},

	initialize: function(options) {
		DebugUtil.log("PagesController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	},

	notConnected: function() {
		DebugUtil.log("PagesController", "notConnected", this.pagesManager);

		var self = this;
		var reconnectPath = "/#/";
        var locationArgs = UrlUtil.getArgsFromLocation();
        if (locationArgs && locationArgs["onConnectPath"])
            reconnectPath = decodeURIComponent(locationArgs["onConnectPath"]);

        var notConnectedPage = new NotConnectedPage({
    		state: this.state
    	});
    	this.pagesManager.renderPage(notConnectedPage);
    	this.listenTo(notConnectedPage, notConnectedPage.ON_RECONNECT_BUTTON_CLICK, function() {
    		DebugUtil.log("PagesController", "notConnectedPageReconnectButton.click();", reconnectPath);
    		if (!ConnectionUtil.isDeviceConnected()) {
                notConnectedPage.showCannotConnectError();
                return false;
            }
            window.location = reconnectPath;
    	});

    	$(ConnectionUtil).unbind(ConnectionUtil.ON_CONNECTED)
        $(ConnectionUtil).bind(ConnectionUtil.ON_CONNECTED, function() {
            window.location = reconnectPath;
        });
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = PagesController;