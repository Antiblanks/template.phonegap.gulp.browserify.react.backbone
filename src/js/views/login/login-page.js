/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");

// Views
var AbstractPage            = require("views/abstract-page").View;

// Templates
var loginPageTemplate       = require("templates/login/login-page.tpl");

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var LoginPageView = AbstractPage.extend({
    initialize: function () {
        DebugUtil.log("LoginPageView", "initialized");
        AbstractPage.prototype.initialize.apply(this, arguments);
        this.ON_LOGIN_FACEBOOK_BUTTON_CLICK;
        this.loginLoadingTimer = null;
        this.animateInTimer = null;
    },

    remove: function () {
        DebugUtil.log("LoginPageView", "remove");
        if (this.loginLoadingTimer)
            window.clearTimeout(this.loginLoadingTimer);
        if (this.animateInTimer)
            window.clearTimeout(this.animateInTimer);
        AbstractPage.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("LoginPageView", "render", this.$el, loginPageTemplate({}));
        
        var self = this;
        this.$el.html(loginPageTemplate({}));

        $(document).ready(function () {
            self.$el.find(".login-facebook-button").click(function(evt) {
                self.showLoginLoading();
                self.trigger(self.ON_LOGIN_FACEBOOK_BUTTON_CLICK, {});
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });
            if (self.animateInTimer)
                window.clearTimeout(self.animateInTimer);
            self.animateInTimer = window.setTimeout(function() {
                self.$el.find(".page-content").addClass("animate-in");
            }, 100);
        });
        
        AbstractPage.prototype.render.apply(this, arguments);
    },

    showLoginError: function(loginErrorMessageSelector) {
        this.showMessage("#login-error-messages", loginErrorMessageSelector);
        this.hideLoginLoading();
    },

    showLoginLoading: function() {
        var self = this;
        this.$el.find("a.login-facebook-button").hide();
        this.$el.find(".login-loading-contacting-facebook").show();
        this.$el.find(".login-loading-synching-friends").hide();
        if (this.loginLoadingTimer)
            window.clearTimeout(this.loginLoadingTimer);
        this.loginLoadingTimer = window.setTimeout(function() {
            self.$el.find(".login-loading-contacting-facebook").hide();
            self.$el.find(".login-loading-synching-friends").show();
        }, 2000);
    },

    hideLoginLoading: function() {
        this.$el.find("a.login-facebook-button").show();
        this.$el.find(".login-loading-contacting-facebook").hide();
        this.$el.find(".login-loading-synching-friends").hide();
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = LoginPageView;
