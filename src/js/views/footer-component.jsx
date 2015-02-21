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

var FooterComponent = React.createClass({
	componentDidMount: function() {
		DebugUtil.log("FooterComponent", "componentDidMount();", this.props);
		if (typeof this.props.onFooterComponentMounted == "function")
			this.props.onFooterComponentMounted();
		this.props.model.on("change", function() {
			this.forceUpdate();
		}.bind(this));
	},

	render: function() {
		DebugUtil.log("FooterComponent", "render();", this.props);
		return (
			<div className="react-component-container">
				<div className="footer-content">
					<span className="antiblanks-shout-out">
						Brought to you by <a onClick={this.props.onAntiblanksShoutOutButtonClick} href="#" target="_blank"><span className="antiblanks-logo medium-grey">anti<span className="highlight">blank</span>s</span></a>
					</span>
				</div>
			</div>
		);
	}
});

/*************************************
 * Exports
 *************************************/

exports.Component = FooterComponent;