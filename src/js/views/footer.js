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
var ReactFooterComponent    = require("views/footer-component").Component;

/*************************************
 * Classes
 *************************************/

var FooterView = Backbone.View.extend({
	el: null,

    initialize: function (options) {
        DebugUtil.log("FooterView", "initialized");
        this.$el = options.el;
        this.model = options.model;
    },

    render: function () { 
        DebugUtil.log("FooterView", "render", this.$el);

        var self = this;

        React.renderComponent(new ReactFooterComponent({
            model: self.model,
            onFooterComponentMounted: this.onFooterComponentMounted.bind(this),
            onAntiblanksShoutOutButtonClick: this.onAntiblanksShoutOutButtonClick.bind(this)
        }), this.$el.get(0));

        $(document).ready(function() {
            // @todo: Complete logic here...
        });
    },

    onFooterComponentMounted: function() {
        DebugUtil.log("FooterView", "onFooterComponentMounted();");
        // @todo: Add logic here to process upon component mounted
    },

    onAntiblanksShoutOutButtonClick: function() {
        DebugUtil.log("FooterView", "onAntiblanksShoutOutButtonClick();");
        // Navigate to Antiblanks URI
        // @note: Obviously we could just use the href attribute but this is just to illustrate how to call out from a React component
        window.location = "http://www.antiblanks.com";
    }
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.View = FooterView;
