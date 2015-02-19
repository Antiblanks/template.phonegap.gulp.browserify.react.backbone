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

var UsersSessionGateway = function(state) {
    var webServiceUtil = new WebServiceUtil(
        GlobalConfig.webServiceApiKey,
        GlobalConfig.webServiceClientUsername,
        GlobalConfig.webServiceClientPassword);

    return {
        loginOrRegisterWithFacebook: function(facebookLoginRegisterObject, callback) {
            DebugUtil.log(
                "UsersSessionGateway", 
                "loginOrRegisterWithFacebook();", 
                facebookLoginRegisterObject);
            // @todo: Replace with call to webservice
            window.setTimeout(function() {
                callback({
                    "success": true
                });
            }, 500);
            /*AjaxUtil.ajax({
                url: GlobalConfig.webServiceSecureBaseUri + "/users_sessions/loginorregisteruserwithfacebook.json",
                type: "POST",
                dataType: "json",
                cache: false,
                crossDomain: true,
                beforeSend: function(request) {
                    request.setRequestHeader(
                        "Authorization", 
                        webServiceUtil.getWebserviceRequestAuthorizationHeader());
                },
                data: facebookLoginRegisterObject
            }).done(function(data) {
                DebugUtil.log("UsersSessionGateway", "loginOrRegisterWithFacebook(); Data received", data);
                callback(data);
            }).fail(function(error) {
                DebugUtil.log("UsersSessionGateway", "loginOrRegisterWithFacebook(); Fetch error", error);
                callback(null);
            });*/
            return true;
        },

        logout: function(callback) {
            DebugUtil.log("UsersSessionGateway", "logout();");
            // @todo: Replace with call to webservice
            window.setTimeout(function() {
                callback({
                    "success": true,
                    "data": {
                        "users_session": {}
                    }
                });
            }, 500);
            /*AjaxUtil.ajax({
                url: GlobalConfig.webServiceSecureBaseUri + "/users_sessions/logoutuser.json",
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
                data: {}
            }).done(function(data) {
                DebugUtil.log("UsersSessionGateway", "logout(); Data received", data);
                callback(data);
            }).fail(function(error) {
                DebugUtil.log("UsersSessionGateway", "logout(); Fetch error", error);
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

exports.Gateway = UsersSessionGateway;