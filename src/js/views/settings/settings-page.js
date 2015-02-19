/*************************************
 * Imports
 *************************************/

// Library
var $                           = require("jquery");
var _                           = require("underscore");
var Backbone                    = require("backbone");
Backbone.$                      = $;
var React                       = require("react");

// Views
var AbstractPage                = require("views/abstract-page").View;

// Templates
var settingsPageTemplate        = require("templates/settings/settings-page.tpl");

// Utils
var DebugUtil                   = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var SettingsPageView = AbstractPage.extend({
    initialize: function (options) {
        DebugUtil.log("SettingsPageView", "initialized", options);
        this.settingsModel = options.settingsModel;
        AbstractPage.prototype.initialize.apply(this, arguments);
    },

    remove: function () {
        DebugUtil.log("SettingsPageView", "remove");
        AbstractPage.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("SettingsPageView", "render", this.$el, this.settingsModel);

        var self = this;
        this.$el.html(settingsPageTemplate({}));

        $(document).ready(function() {
            // @todo: Complete logic here...
        });
        
        AbstractPage.prototype.render.apply(this, arguments);
    },

    showSettingsUpdated: function() {
        this.showMessage("#success-messages", "success-settings-updated");
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = SettingsPageView;
