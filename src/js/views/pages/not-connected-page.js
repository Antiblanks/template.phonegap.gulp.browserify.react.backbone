/*************************************
 * Imports
 *************************************/

// Library
var $                           = require("jquery");
var _                           = require("underscore");
var Backbone                    = require("backbone");
Backbone.$                      = $;

// Views
var AbstractPage                    = require("views/abstract-page").View;

// Templates
var notConnectedPageTemplate        = require("templates/pages/not-connected-page.tpl");

// Utils
var DebugUtil                   = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var NotConnectedPageView = AbstractPage.extend({
    initialize: function () {
        DebugUtil.log("NotConnectedPageView", "initialized");
        this.ON_RECONNECT_BUTTON_CLICK = "onReconnectButtonClick";
        AbstractPage.prototype.initialize.apply(this, arguments);
    },

    remove: function () {
        DebugUtil.log("NotConnectedPageView", "remove");
        this.$el.find("a.reconnect-button").unbind("click");
        AbstractPage.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("NotConnectedPageView", "render", this.$el);

        var self = this;
        
        this.$el.html(notConnectedPageTemplate({}));

        $(document).ready(function() {
            DebugUtil.log("NotConnectedPageView", "render");

            // Setup reconnect button
            // Though the application will reinitiate upon connection received 
            // this gives the user a way of manually reconnecting if someting goes wrong
            self.$el.find("a.reconnect-button").unbind("click");
            self.$el.find("a.reconnect-button").click(function(evt) {
                self.trigger(self.ON_RECONNECT_BUTTON_CLICK, {});
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });
        });
        
        AbstractPage.prototype.render.apply(this, arguments);
    },

    showCannotConnectError: function() {
        this.showMessage("#error-messages", "error-cannot-connect");
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = NotConnectedPageView;
