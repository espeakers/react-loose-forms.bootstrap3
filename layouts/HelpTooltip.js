var dd = require("react-dd");
var HoverMixin = require("react-hover-mixin");

require("./HelpTooltip.css.js");

module.exports = dd.createClass({
  getInitialState: function(){
    //just position it off screen so the height/width stays intact
    return {
      top: -100000,
      left: -100000
    };
  },
  onClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.__showIt(e.clientX, e.clientY);
  },
  onMouseEnter: function(e){
    this.__showIt(e.clientX, e.clientY);
  },
  onMouseLeave: function(){
    this.__hideIt();
  },
  onRef: function(popover_node){
    this.popover_node = popover_node;
  },
  __showIt: function(left, top){
    if(this.popover_node){
      top -= this.popover_node.offsetHeight;
      left -= this.popover_node.offsetWidth/2;
    }
    this.setState({top: top, left: left});
  },
  __hideIt: function(){
    //just position it off screen so the height/width stays intact
    this.setState({
      top: -100000,
      left: -100000
    });
  },
  render: function(){
    var title = this.props.title;
    var content = this.props.content;

    return dd.a({
        className: 'HelpTooltip',
        href: '#',
        style: {position: 'relative'},
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onClick: this.onClick
      },
      dd.i({className: "react-bootstrap3-tooltip-icon react-bootstrap3-tooltip-icon-help-circled"}),
      dd.div({className: 'popover top', ref: this.onRef, style: {
          display: 'block',//always show so that onMouseEnter we have the height/width of this popover
          width: content ? Math.max(70, content.length * 14) + 'px' : 'auto',//aprox the width for the content, note that .popover class sets a max-width, so no worries
          position: 'fixed',//this way a parent container can't overflow:hidden this
          top: this.state.top + 'px',
          left: this.state.left + 'px',

          //normalizing styles (so parent font styling doesn't mess with this)
          fontSize: '14px',
          color: 'black',
          textAlign: 'left',
          fontWeight: 'normal'
        }},
        dd.div({className: 'arrow'}),
        title ? dd.h3({className: 'popover-title'}, title) : '',
        content ? dd.div({className: 'popover-content'}, content) : ''
      )
    );
  }
});
