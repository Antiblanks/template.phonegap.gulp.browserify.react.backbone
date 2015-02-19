/*************************************
 * Imports
 *************************************/

// Library
var $                       = require("jquery");
var _                       = require("underscore");

// Utils
var DebugUtil               = require("utils/debug").Util;

/*************************************
 * Classes
 *************************************/

var ButtonsUtil = function() {
	var buttonsUtil = {
		REQUEST_HISTORY_GO_BACK: "onRequestHistoryGoBack",

		enablePageButtons: function(pageManager, viewElement) {
			DebugUtil.log("ButtonsUtil", "enablePageButtons();", pageManager, viewElement);
			if (!viewElement || $(viewElement).length == 0)
				return false;
			viewElement.find("a.page-button").unbind("mousedown");
			viewElement.find("a.page-button").mousedown(function(evt) {
				DebugUtil.log("ButtonsUtil", "mousedown();", $(this).attr("href"), pageManager, $(this).hasClass("disabled"));
				$(this).hasClass("go-back")
		    		? pageManager.setBackDetected(true)
		    		: pageManager.setBackDetected(false); 
			});
			viewElement.find("a.page-button").unbind("click");
			viewElement.find("a.page-button").click(function(evt) {
				DebugUtil.log("ButtonsUtil", "click();", $(this).attr("href"), pageManager, $(this).hasClass("disabled"));
				if ($(this).hasClass("disabled")) {
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}
				if ($(this).hasClass("history-go-back")) {
					$(buttonsUtil).trigger(buttonsUtil.REQUEST_HISTORY_GO_BACK, {});
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}
			});
		},

		disablePageButtons: function(viewElement) {
			DebugUtil.log("ButtonsUtil", "disablePageButtons();", viewElement);
			if (!viewElement || $(viewElement).length == 0)
				return false;
			viewElement.find("a.page-button").unbind("mousedown");
			viewElement.find("a.page-button").unbind("click");
			return true;
		}
	};

	return buttonsUtil;
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new ButtonsUtil();