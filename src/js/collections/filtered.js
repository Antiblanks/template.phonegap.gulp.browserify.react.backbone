/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");
var Backbone                = require("backbone");

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var FilteredCollection = function(originalCollection, options) {
	DebugUtil.log("FilteredCollection", "initialised", originalCollection, options);
	var self = this;

	this.originalCollection = originalCollection;
	this.options = {};
	this._reset();
	this.reset(originalCollection.models);
	this.initialize.apply(this, arguments);

	function onOrginalCollectionChange() {
		if (typeof self.filterFunction == "function")
			self.setFilter(self.filterFunction);
		self.trigger("reset");
	};

	if (options.filterOnAdd) {
		this.listenTo(this.originalCollection, "add", onOrginalCollectionChange);
	}

	if (options.filterOnRemove) {
		this.listenTo(this.originalCollection, "remove", onOrginalCollectionChange);
	}

	if (options.filterOnChange) {
		this.listenTo(this.originalCollection, "change", onOrginalCollectionChange);
	}

	if (options.filterOnReset) {
		this.listenTo(this.originalCollection, "reset", onOrginalCollectionChange);
	}
};

_.extend(FilteredCollection.prototype, Backbone.Collection.prototype, {
	setFilter: function (filterFunction) {
		this.filterFunction = filterFunction;
		this.reset(this.originalCollection.filter(this.filterFunction));
	},
	clearFilter: function () {
		this.reset(this.originalCollection.models);
	}
});

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Collection = FilteredCollection;