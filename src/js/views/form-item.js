/*************************************
 * Imports
 *************************************/

// Library
var $                               = require("jquery");
var _                               = require("underscore");
var Backbone                        = require("backbone");
Backbone.$                          = $;
var React                           = require("react");

// Utils
var DebugUtil                       = require("utils/debug").Util;
var DateUtil                        = require("utils/date").Util;
var ValidateUtil                    = require("utils/validate").Util;

/*************************************
 * Classes
 *************************************/

var FormItemView = Backbone.View.extend({
    initialize: function (options) {
        DebugUtil.log("FormItemView", "initialized", options);
        this.errorHideTimer = null;
    },

    remove: function() {
        if (this.errorHideTimer)
            window.clearTimeout(this.errorHideTimer);
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    render: function () {
        DebugUtil.log("FormItemView", "render");

        var self = this;

        $(document).ready(function(evt) {
            self.resetForm();
        });
    },

    showFormItemError: function() {
        DebugUtil.log("FormItemView", "showFormItemError();", this.$el);
        var self = this;
        self.$el.addClass("error");
        if (this.errorHideTimer)
            window.clearTimeout(this.errorHideTimer);
        this.errorHideTimer = window.setTimeout(function() {
            self.$el.removeClass("error");
        }, 1500);
    },

    resetForm: function() {
        DebugUtil.log("FormItemView", "resetForm();");
        this.$el.find("input").val("");
        this.$el.removeClass("error");
        if (this.errorHideTimer)
            window.clearTimeout(this.errorHideTimer);
    },

    getValue: function() {
        return this.$el.find("input").val();
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = FormItemView;
