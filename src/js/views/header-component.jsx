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

/*************************************
 * Classes
 *************************************/

var HeaderComponent = React.createClass({
	componentDidMount: function() {
		DebugUtil.log("HeaderComponent", "componentDidMount();", this.props);
		if (typeof this.props.onHeaderComponentMounted == "function")
			this.props.onHeaderComponentMounted();
		this.props.model.on("change", function() {
			this.forceUpdate();
		}.bind(this));
	},

	render: function() {
		DebugUtil.log("HeaderComponent", "render();", this.props);
		return (
			<div className="react-component-container">
				<div className="header-content">
					<div className="logo logo-medium white"></div>
					<a className="hamburger-menu-button page-button go-forward" href="#/menu"></a>
				</div>
			</div>
		);
	}
});

/*************************************
 * Exports
 *************************************/

exports.Component = HeaderComponent;