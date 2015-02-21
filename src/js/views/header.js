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

// React components
var ReactHeaderComponent    = require("views/header-component").Component;

/*************************************
 * Classes
 *************************************/

var HeaderView = Backbone.View.extend({
	el: null,

	initialize: function (options) {
        DebugUtil.log("HeaderView", "initialized");
        this.$el = options.el;
        this.model = options.model;
    },

    render: function () {
        DebugUtil.log("HeaderView", "render", this.$el); 

        var self = this;
        
        React.renderComponent(new ReactHeaderComponent({
            model: self.model,
            onHeaderComponentMounted: this.onHeaderComponentMounted.bind(this)
        }), this.$el.get(0));

        $(document).ready(function() {
            // @todo: Complete logic here...
        });
    },

    showOpenHeaderMenuButton: function() {
    	this.$el.find("a.hamburger-menu-button").show();
    },

    hideOpenHeaderMenuButton: function() {
    	this.$el.find("a.hamburger-menu-button").hide();
    },

    onHeaderComponentMounted: function() {
        DebugUtil.log("HeaderView", "onHeaderComponentMounted();");
        // @todo: Add logic here to process upon component mounted
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
