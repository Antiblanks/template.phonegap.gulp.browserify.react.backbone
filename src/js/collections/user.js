/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");

// Utils
var DebugUtil               = require("utils/debug").Util;

// Models
var UserModel				= require("models/user").Model;

/*************************************
 * Classes
 *************************************/

var UserCollection = Backbone.Collection.extend({
	model: UserModel,

	initialize: function (models, options) {
		DebugUtil.log("UserCollection: initialized", models, options, typeof options);

		var self = this;
		this.options = {};
		
		if (typeof options === "object")
			$.extend(this.options, options);
	},

	resetModels: function(data) {
		this.reset(data);
	},

	addModels: function(models) {
		if (this.options.canSelectOnlyNItems) {
			if (models.length > this.options.canSelectOnlyNItems) 
				return false;
            if (this.length >= this.options.canSelectOnlyNItems) {
                if (this.options.canSelectOnlyNItems == 1 && this.options.maxItemsReachedDeselectLast) {
                    this.reset();
                } else {
                    return false;
                }
            }
        }
		this.add(models);
		return true;
	},

	removeModel: function(model) {
		this.remove([model]);
	},

	removeModels: function(models) {
		this.remove(models);
	},

	getModelBySelectedFromListCid: function(selectedFromListCid) {
		DebugUtil.log("UserCollection: getModelBySelectedFromListCid();", selectedFromListCid);
		return this.find(function(model) { 
	    	return model.selectedFromListCid == selectedFromListCid; 
	    });
	},

	getModelsSelectedFromListCids: function() {
		var selectedFromListCids = [];
		_.each(this.models, function(model) {
			selectedFromListCids.push(model.selectedFromListCid);
		});
		return selectedFromListCids;
	},

	removeModelBySelectedFromListCid: function(selectedFromListCid) {
		var model = this.getModelBySelectedFromListCid(selectedFromListCid);
		DebugUtil.log("UserCollection: removeModelBySelectedFromListCid();", selectedFromListCid, model);
		if (model) {
			this.remove([model]);
			return true;
		}
		return false;
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Collection = UserCollection;