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
var menuPageTemplate        = require("templates/menu/menu-page.tpl");

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var MenuPageView = AbstractPage.extend({
    initialize: function (options) {
        DebugUtil.log("MenuPageView", "initialized");
        this.LOGOUT_BUTTON_CLICK = "onLogoutButtonClick";
        this.state = options.state;
        AbstractPage.prototype.initialize.apply(this, arguments);
    },

    remove: function () {
        DebugUtil.log("MenuPageView", "remove");
        AbstractPage.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("MenuPageView", "render", this.$el, menuPageTemplate({}));

        var self = this;
        this.$el.html(menuPageTemplate({}));

        $(document).ready(function() {
            // Setup logout button
            self.$el.find("a.logout-button").unbind("click");
            self.$el.find("a.logout-button").click(function(evt) {
                self.trigger(self.LOGOUT_BUTTON_CLICK, {});
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });

            self.$el.find("a.history-go-back").removeClass("disabled");
            var previousHistoryItem = self.state.getPreviousItemInRouteHistory();
            if (previousHistoryItem.name == "login") {
                self.$el.find("a.history-go-back").addClass("disabled");
            }
        });
        
        AbstractPage.prototype.render.apply(this, arguments);
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = MenuPageView;
