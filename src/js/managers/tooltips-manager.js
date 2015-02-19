/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");

/*************************************
 * Classes
 *************************************/

var TooltipsManager = Backbone.View.extend({
    el: null,

    initialize: function(options) {
        var self = this;
        this.$el = options.el;
        this.tooltips = {};

        $(document).ready(function() {
            $(document).click(function(evt) {
                self.hideTooltips();
            });
        });
    },

    addTooltip: function(tooltipData) {
        var self = this;
        var tooltip = this.tooltips[tooltipData.tooltipId] = tooltipData;

        if (tooltip.element &&
            tooltip.element.find(".tooltip-click-captcha").length != 0) {
            tooltip.element.find(".tooltip-click-captcha").unbind("click");
            tooltip.element.find(".tooltip-click-captcha").click(function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });
        }

        if (tooltip.element &&
            tooltip.element.find(".tooltip-close-button").length != 0) {
            tooltip.element.find(".tooltip-close-button").unbind("click");
            tooltip.element.find(".tooltip-close-button").click(function(evt) {
                self.hideTooltip(
                    $(this).closest(".tooltip").data("tooltipid"));
                evt.stopPropagation();
                evt.preventDefault();
                return false;
            });
        }
        
        return tooltip;
    },

    addTooltips: function(tooltips) {
        for (var i=0; i<tooltips.length; i++) {
            this.addTooltip(tooltips[i]);
        }
    },

    removeTooltip: function(tooltipId) {
        delete this.tooltips[tooltipId];
        return true;
    },

    removeTooltips: function() {
        for (var tooltipId in this.tooltips) {
            delete this.tooltips[tooltipId];
        }
        this.tooltips = {};
    },

    showTooltip: function(tooltipData) {
        this.hideTooltips();
        var tooltip = this.tooltips[tooltipData.tooltipId];
        if (!tooltip) {
            tooltip = this.addTooltip(tooltipData);
        }
        tooltip.element.show();
        tooltip.element.css({
            "opacity": 0
        });
        var topPos = 0;
        if (tooltip.orientation == "above") {
            topPos = tooltip.target.position().top - tooltip.element.outerHeight() - 8;
            tooltip.element.css("top", topPos + 12);
            tooltip.element.css("left", (tooltip.target.position().left - tooltip.element.outerWidth()) + tooltip.target.outerWidth());
        }
        if (tooltip.orientation == "below") {
            // @todo: Add orientation as and when required
        }
        if (tooltip.orientation == "left") {
            // @todo: Add orientation as and when required
        }
        if (tooltip.orientation == "right") {
            // @todo: Add orientation as and when required
        }
        tooltip.element.stop();
        tooltip.element.animate({
            "opacity": 1,
            "top": topPos
        }, {
            duration: 300
        });
    },

    hideTooltip: function(tooltipId) {
        var tooltip = this.tooltips[tooltipId];
        if (tooltip) {
            tooltip.element.stop();
            tooltip.element.hide();
        }
    },

    hideTooltips: function() {
        for (var tooltipId in this.tooltips) {
            this.hideTooltip(tooltipId);
        }
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Manager = TooltipsManager;