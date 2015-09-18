var dd = require("react-dd");
var HoverMixin = require("react-hover-mixin");

require("./HelpTooltip.css.js");

module.exports = dd.createClass({
  mixins: [HoverMixin],
  hoverable_not_relative_to_parent_bounding_rect: true,
  __onClick: function(e){
    e.preventDefault();
    e.stopPropagation();
  },
  render: function(){
    var title = this.props.title;
    var content = this.props.content;

    return dd.a({
        className: 'HelpTooltip',
        href: '#',
        style: {position: 'relative'},
        onMouseEnter: this.hoverable_onMouseEnter,
        onMouseLeave: this.hoverable_onMouseLeave,
        onClick: this.__onClick
      },
      dd.i({className: "react-bootstrap3-tooltip-icon react-bootstrap3-tooltip-icon-help-circled"}),
      dd.div({className: 'popover top', ref: 'hoverable', style: {
          display: this.state.hover ? 'block' : 'none',//hide show so that we can keep access to the dom node's width height in componentDidUpdate
          width: content ? Math.max(70, content.length * 14) + 'px' : 'auto',//aprox the width for the content, note that .popover class sets a max-width, so no worries
          top: this.state.hoverable_top + 'px',
          left: this.state.hoverable_left + 'px',

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
