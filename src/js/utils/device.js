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

var DeviceUtil = function() {
	return {
		getDeviceType: function(toLowerCase) {
			var deviceType = 
				(navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : 
				(navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : 
				(navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : 
				(navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : 
				null;
			DebugUtil.log("DeviceUtil", "getDeviceType();", deviceType);
			if (deviceType && toLowerCase) 
				deviceType = deviceType.toLowerCase();
			return deviceType;
		},

		canDeviceSendSilentSms: function() {
			var deviceType = this.getDeviceType();
			DebugUtil.log("DeviceUtil", "canDeviceSendSilentSms();", deviceType);
			if (!deviceType)
				return false;
			switch (deviceType.toLowerCase()) {
				case "android":
					return true;
			}
			return false;
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

exports.Util = new DeviceUtil();
