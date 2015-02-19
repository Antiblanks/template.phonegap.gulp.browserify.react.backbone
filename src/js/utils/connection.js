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

var ConnectionUtil = function(onConnectedCallback) {
	var connectionUtil = {
		ON_CONNECTED: "onConnected",

		isDeviceConnected: function() {
			DebugUtil.log("ConnectionUtil", "isDeviceConnected();", navigator);

			function canReachHost() {
				var xhr = new (window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
				var status;
				xhr.open("HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);
				try {
					xhr.send();
					return (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304));
				} catch (error) {
					return false;
				}
			};

			var isRunningInCordova = 
				document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
			if (!isRunningInCordova)
				return canReachHost();

			if (!navigator || 
				!navigator.network || 
				!navigator.network.connection || 
				!navigator.network.connection.type)
				return false;

			var networkConnectionType = navigator.network.connection.type;
			return networkConnectionType.toLowerCase() !== "none";
		},

		setOnConnectedCallback: function(callback) {
			connectionUtil.onConnectedCallback = callback;
		}
	};

	connectionUtil.setOnConnectedCallback(onConnectedCallback);
	if (typeof document.addEventListener == "function")
		document.addEventListener("online", function(evt) {
			if (typeof connectionUtil.onConnectedCallback == "function")
				connectionUtil.onConnectedCallback();
			$(connectionUtil).trigger(connectionUtil.ON_CONNECTED, {});
		}, false);

	return connectionUtil;
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new ConnectionUtil();
