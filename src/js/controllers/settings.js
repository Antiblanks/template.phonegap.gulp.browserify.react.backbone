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
var SettingsPage 			= require("views/settings/settings-page").View;

// Utils
var DebugUtil               = require("utils/debug").Util;

// Models
var SettingsModel			= require("models/settings").Model;

/*************************************
 * Classes
 *************************************/

var SettingsController = AppController.extend({
	routes: {
		'settings': 'settings'
	},

	initialize: function(options) {
		DebugUtil.log("SettingsController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	},

	settings: function() {
		DebugUtil.log("SettingsController", "settings", this.pagesManager);
		var self = this;

		function renderSettingsPage(settingsModel) {
			DebugUtil.log("GiftGroupController", "renderSettingsPage", settingsModel);
			var settingsPage = new SettingsPage({
	    		state: self.state,
	    		settingsModel: settingsModel
	    	});
	    	self.listenTo(settingsPage, settingsPage.SAVE_BUTTON_CLICK, function(newSettingsObject) {
	    		global.UsersSettingsGateway.updateUsersSettings(newSettingsObject, function(usersSettingsResponse) {
					DebugUtil.log("SettingsController", "updateUsersSettings();", "received data", usersSettingsResponse);
					settingsPage.showSettingsUpdated();
				});
			});
			self.pagesManager.renderPage(settingsPage);
			return settingsPage;
		};

		global.UsersSettingsGateway.getUsersSettings(function(usersSettingsResponse) {
			DebugUtil.log("SettingsController", "settings();", "received data", usersSettingsResponse);
			if (usersSettingsResponse &&
				usersSettingsResponse["data"] &&
				usersSettingsResponse["data"]["users_settings"]) {
				settingsModel.set(usersSettingsResponse["data"]["users_settings"]);
				settingsModel.initialize();
				settingsPage.render();
			}
		});

		var settingsModel = new SettingsModel();
		var settingsPage = renderSettingsPage(settingsModel);
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Controller = SettingsController;