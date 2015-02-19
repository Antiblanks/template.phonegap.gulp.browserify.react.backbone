/*************************************
 * Imports
 *************************************/

// @todo: Add imports here...

/*************************************
 * Classes
 *************************************/

var ViewModeUtil = function() {
	return {
		isViewModeDesktop: function() {
			return $("body .view-mode.view-mode-desktop").css("display") === "block";
		},
		
		isViewModeTablet: function() {
			return $("body .view-mode.view-mode-tablet").css("display") === "block";
		},

		isViewModeMobile: function() {
			return $("body .view-mode.view-mode-mobile").css("display") === "block";
		},

		getViewMode: function() {
			if (this.isViewModeDesktop())
				return this.DESKTOP;
			if (this.isViewModeTablet())
				return this.TABLET;
			if (this.isViewModeMobile())
				return this.MOBILE;
			return null;
		},

		DESKTOP: "viewModeDesktop",
		TABLET: "viewModeTablet",
		MOBILE: "viewModeMobile"
	};
};

/*************************************
 * Process
 *************************************/

// @todo: Add any processing logic here...

/*************************************
 * Exports
 *************************************/

exports.Util = new ViewModeUtil();