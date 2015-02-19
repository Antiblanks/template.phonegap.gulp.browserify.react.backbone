/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");

// Utils
var DebugUtil	               	= require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var UrlUtil = function() {
	return {
		addArgsToUrl: function (url, args) {
			DebugUtil.log("UrlUtility", "addArgsToUrl();", url, args);
			var urlArgs = this.getArgsFromUrl(url);
			$.extend(urlArgs, args);
			var queryStrng = this.getQueryStringFromArgs(args, "?");
            return url + queryStrng;
		},

		getQueryStringFromArgs: function(args, prefix) {
			DebugUtil.log("UrlUtility", "getQueryStringFromArgs();", args, prefix);
			var queryString = "";
			for (var key in args) {
				if (queryString.length != 0)
					queryString += "&";	
				var value = args[key];
				if (args[key] && typeof args[key] == "array")
					value = value.join(",");
				queryString += key + "=" + value;
			}
			if (typeof prefix == "string") {
				queryString = prefix + queryString;
			}
			return queryString;
		},

		getArgsFromQueryString: function(queryString) {
			DebugUtil.log("UrlUtility", "getArgsFromQueryString();", queryString);
			var args = {};
			if (!queryString || queryString.length == 0)
				return args;
			var queryStringParts = queryString.split("&");
			for (var i=0; i<queryStringParts.length; i++) {
				var queryStringPartData = queryStringParts[i].split("=");
				if (queryStringPartData.length != 2)
					continue;
				var queryStringPartValue = queryStringPartData[1].split(",");
				if (queryStringPartValue && 
					queryStringPartValue.toString() !== "" &&
					queryStringPartValue.toString() !== "undefined" &&
					queryStringPartValue.toString() !== "null") {
					args[queryStringPartData[0]] = queryStringPartValue;
				}
			}
			return args;
		},

		getArgsFromUrl: function(url) {
			DebugUtil.log("UrlUtility: getArgsFromUrl();", url);
			var args = {};
			if (url.indexOf("?") > -1) {
				var queryString = url.split("?")[1];
				args = this.getArgsFromQueryString(queryString);
			}
			return args;
		},

		getArgsFromLocation: function() {
			DebugUtil.log("UrlUtility", "getArgsFromLocation();", window.location.href);
			return this.getArgsFromUrl(window.location.href);
		}
	};
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new UrlUtil();