/*************************************
 * Imports
 *************************************/

// Library
var $                           = require("jquery");
var _                           = require("underscore");
var Backbone                    = require("backbone");
Backbone.$                      = $;
var React                       = require("react");

// Utils
var DebugUtil                   = require("utils/debug").Util;

var React = require("react");
var Footer = React.createClass({
	render: function() {
		DebugUtil.log("FooterView", "render();");
		return (
			<div className="reactComponentContainer">
				<div className="footer">
					Footer content here...
				</div>
			</div>
		);
	}
});

exports.View = Footer;