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
var LoginPage 				= require("views/login/login-page").View;

// Utils
var DebugUtil               = require("utils/debug").Util;
var DateUtil                = require("utils/date").Util;
var UrlUtil                 = require("utils/url").Util;

// Events
var LoginEvent				= require("events/login");

// Config
var GlobalConfig            = require("config/global");

/*************************************
 * Classes
 *************************************/

var LoginController = AppController.extend({
	routes: {
		'login': 'login'
	},

	initialize: function(options) {
		DebugUtil.log("LoginController", "initialize");
		AppController.prototype.initialize.apply(this, arguments);
	},

	login: function() {
		DebugUtil.log("LoginController", "login", this.pagesManager, global.FacebookUtil);

		var self = this;
		var loginPage = new LoginPage({
    		state: this.state
    	});
    	this.pagesManager.renderPage(loginPage);

        var urlArgs = UrlUtil.getArgsFromLocation();
        var redirectPath = urlArgs["redirectPath"];
        if (!redirectPath)
            redirectPath = "";
        redirectPath = "/#/"+redirectPath;

        this.listenTo(loginPage, loginPage.ON_LOGIN_FACEBOOK_BUTTON_CLICK, function() {
            // Handle dummy login user 1
            if (GlobalConfig.byPassLoginAsDummyUser1) {
                self.trigger(LoginEvent.ON_LOGIN_SUCCESS, {
                    expiry_date: "2015-03-30 10:25:09",
                    id: "1",
                    ip_address: "127.0.0.1",
                    session_id: "1234",
                    user: {
                        id: "1", 
                        facebook_user_id: "1234", 
                        first_name: "Daniel", 
                        last_name: "Ivanovic",
                        date_created: "2015-01-11 20:09:28",
                        date_of_birth: "1982-02-28 00:00:00",
                        email: "email@antiblanks.com",
                        gender: "m",
                        status: "700"
                    },
                    user_id: "1"
                });
                window.location = redirectPath;
                return true;
            }

            // Handle dummy login user 2
            if (GlobalConfig.byPassLoginAsDummyUser2) {
                self.trigger(LoginEvent.ON_LOGIN_SUCCESS, {
                    expiry_date: "2015-03-30 10:25:09",
                    id: "1",
                    ip_address: "127.0.0.1",
                    session_id: "1234",
                    user: {
                        id: "2", 
                        facebook_user_id: "1234", 
                        first_name: "Rachel", 
                        last_name: "Ivanovic",
                        date_created: "2015-01-11 20:09:28",
                        date_of_birth: "1981-02-02 00:00:00",
                        email: "email@antiblanks.com",
                        gender: "m",
                        status: "700"
                    },
                    user_id: "2"
                });
                window.location = redirectPath;
                return true;
            }
            
            // Login the user with Facebook
            global.FacebookUtil.login(
                function(facebookLoginResponse) {
                    DebugUtil.log("LoginController", "FacebookUtil.login();", facebookLoginResponse);
                    if (facebookLoginResponse.status === 'connected') {
                        // Get the basic user information from Facebook
                        global.FacebookUtil.api({
                            path: '/me',
                            success: function(facebookMeResponse) {
                                DebugUtil.log("LoginController", "FacebookUtil.api(me)", facebookMeResponse);
                                var facebookLoginRegisterObject = {};
                                    facebookLoginRegisterObject["facebook_user_id"] = facebookMeResponse["id"];
                                    facebookLoginRegisterObject["facebook_auth_token"] = facebookLoginResponse["authResponse"]["token"];
                                    facebookLoginRegisterObject["email"] = facebookMeResponse["email"];
                                    facebookLoginRegisterObject["first_name"] = facebookMeResponse["first_name"];
                                    facebookLoginRegisterObject["last_name"] = facebookMeResponse["last_name"];
                                    facebookLoginRegisterObject["full_name"] = facebookMeResponse["name"];
                                    facebookLoginRegisterObject["gender"] = 
                                        facebookMeResponse["gender"] == "male" ? "m" : "f";
                                    facebookLoginRegisterObject["date_of_birth"] = DateUtil.DEFAULT_DATETIME_STRING;
                                    if (facebookMeResponse["birthday"]) { 
                                        facebookLoginRegisterObject["date_of_birth"] = DateUtil.getDateTimeStringFromFacebookBirthdayString(facebookMeResponse["birthday"]);
                                    }
                                // Login with our backend
                                global.UsersSessionGateway.loginOrRegisterWithFacebook(facebookLoginRegisterObject, function(loginWithFacebookResponse) {
                                    if (!loginWithFacebookResponse || 
                                        !loginWithFacebookResponse["data"] ||
                                        !loginWithFacebookResponse["data"]["users_session"]) {
                                        loginPage.showLoginError("error-facebook-login-failed");
                                        self.trigger(LoginEvent.ON_LOGIN_FAILED, {});
                                        return false;
                                    }
                                    self.trigger(LoginEvent.ON_LOGIN_SUCCESS, loginWithFacebookResponse["data"]["users_session"]);
                                    window.location = redirectPath;
                                    return true;
                                });
                            },
                            error: function(error) {
                                loginPage.showLoginError("error-facebook-login-failed");
                                self.trigger(LoginEvent.ON_LOGIN_FAILED, {});
                            }
                        });
                    }
                    else {
                        loginPage.showLoginError("error-facebook-login-failed");
                        self.trigger(LoginEvent.ON_LOGIN_FAILED, {});
                    }
                }, {
                    scope: 'public_profile,email,user_friends,user_birthday'
                }
            );
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

exports.Controller = LoginController;