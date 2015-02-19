/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");
Backbone.$                  = $;

/*************************************
 * Classes
 *************************************/

var HeaderModel = Backbone.Model.extend({
    initialize: function() {},
    defaults : {}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Model = HeaderModel;