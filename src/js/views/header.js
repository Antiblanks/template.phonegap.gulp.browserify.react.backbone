/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;
var React                   = require("react");

// Utils
var DebugUtil               = require("utils/debug").Util;

// Templates
var headerTemplate 	       = require("templates/header.tpl");

/*************************************
 * Classes
 *************************************/

var HeaderView = Backbone.View.extend({
	el: null,

	initialize: function (options) {
        DebugUtil.log("HeaderView", "initialized");
        this.$el = options.el;
    },

    render: function () {
        DebugUtil.log("HeaderView", "render", this.$el, headerTemplate({}));

        var self = this;
        this.$el.html(headerTemplate({}));

        $(document).ready(function() {
            // @todo: Complete logic here...
        });
    },

    showOpenHeaderMenuButton: function() {
    	this.$el.find("a.hamburger-menu-button").show();
    },

    hideOpenHeaderMenuButton: function() {
    	this.$el.find("a.hamburger-menu-button").hide();
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = HeaderView;
