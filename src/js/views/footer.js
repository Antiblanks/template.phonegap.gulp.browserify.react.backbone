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
var footerTemplate 	       = require("templates/footer.tpl");

/*************************************
 * Classes
 *************************************/

var FooterView = Backbone.View.extend({
	el: null,

    initialize: function (options) {
        DebugUtil.log("FooterView", "initialized");
        this.$el = options.el;
    },

    render: function () {
        DebugUtil.log("FooterView", "render", this.$el, footerTemplate({}));

        var self = this;
        this.$el.html(footerTemplate({}));

        $(document).ready(function() {
            // @todo: Complete logic here...
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

exports.View = FooterView;
