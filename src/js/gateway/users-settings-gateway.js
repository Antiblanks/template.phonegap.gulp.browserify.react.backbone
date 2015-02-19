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
var WebServiceUtil          = require("utils/webservice").Util;
var AjaxUtil                = require("utils/ajax").Util;

// Config
var GlobalConfig            = require("config/global");

/*************************************
 * Classes
 *************************************/

var UsersSettingsGateway = function(state) {
    var webServiceUtil = new WebServiceUtil(
        GlobalConfig.webServiceApiKey,
        GlobalConfig.webServiceClientUsername,
        GlobalConfig.webServiceClientPassword);
    
    return {
        getUsersSettings: function(callback) {
            DebugUtil.log("UsersSettingsGateway", "getUsersSettings();");
            // @todo: Replace with call to webservice
            window.setTimeout(function() {
                callback({
                    "success": true
                });
            }, 500);
            /*AjaxUtil.ajax({
                url: GlobalConfig.webServiceBaseUri + "/users_settings/getuserssettings.json",
                type: "GET",
                dataType: "json",
                cache: false,
                crossDomain: true,
                beforeSend: function(request) {
                    request.setRequestHeader(
                        "Authorization", 
                        webServiceUtil.getWebserviceRequestAuthorizationHeader(
                            state.getLoggedInUsersSessionId()));
                },
                data: {}
            }).done(function(data) {
                DebugUtil.log("UsersSettingsGateway", "getUsersSettings(); Data received", data);
                callback(data);
            }).fail(function(error) {
                DebugUtil.log("UsersSettingsGateway", "getUsersSettings(); Fetch error", error);
                callback(null);
            });*/
            return true;
        },

        updateUsersSettings: function(settingsObject, callback) {
            DebugUtil.log("UsersSettingsGateway", "updateUsersSettings();", settingsObject);
            // @todo: Replace with call to webservice
            window.setTimeout(function() {
                callback({
                    "success": true
                });
            }, 500);
            /*AjaxUtil.ajax({
                url: GlobalConfig.webServiceBaseUri + "/users_settings/updateuserssettings.json",
                type: "POST",
                dataType: "json",
                cache: false,
                crossDomain: true,
                beforeSend: function(request) {
                    request.setRequestHeader(
                        "Authorization", 
                        webServiceUtil.getWebserviceRequestAuthorizationHeader(
                            state.getLoggedInUsersSessionId()));
                },
                data: settingsObject
            }).done(function(data) {
                DebugUtil.log("UsersSettingsGateway", "updateUsersSettings(); Data received", data);
                callback(data);
            }).fail(function(error) {
                DebugUtil.log("UsersSettingsGateway", "updateUsersSettings(); Fetch error", error);
                callback(null);
            });*/
            return true;
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

exports.Gateway = UsersSettingsGateway;