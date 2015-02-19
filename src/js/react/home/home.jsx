/** @jsx React.DOM */
// @todo: Complete example react components

var React = require("react");
var $ = require("jquery");
var _ = require("underscore");

var Footer = require("react/common/footer").View;

var Home = React.createClass({
      render: function() {
        return (
            <div className="reactComponentContainer">
              <Content name={this.props.name}/>
            </div>
        );
      }
});

exports.Home = Home;

var Content = React.createClass({
  componentDidMount: function() {
    var self = this;
    var counter = 0;
    setInterval(function() {
        counter++;
        $(self.getDOMNode())
          .find(".jqueryUptadable")
          .text("Updated by JQuery! -> "+counter);
    },1000);
    console.debug("interval set");
  },

  render: function() {
    return (
        <div className="reactComponentContainer">
          <h1>Hello {this.props.name}</h1>
          <p>This is rendered with a React JSX Component! yeah2</p>
          <div>
              <img src="img/logo.png"/>
          </div>
          <div className="jqueryUptadable">
              This should be updated soon by JQuery
          </div>
        </div>
    );
  }

});

exports.Content = Content;
