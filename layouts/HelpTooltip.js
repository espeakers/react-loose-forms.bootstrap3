/**
 * There is a single GlobalTooltip that is mounted once on the page in the body
 * The purpose is to avoid hairy CSS situations where the tooltip is inside a
 * container that is stomping over it.
 *
 * What doesn't work:
 * 1) Position relative the tooltip doesn't work when inside a container that is 
 *    using overflow: hidden. It will clip the tooltip regardlis of z-index
 *
 * 2) Position fixed directly inside the component almost works, except for inside
 *    a parent element that is using css tranform, i.e. bootstrap modals
 */
var _ = require("lodash");
var dd = require("react-dd");
var React = require("react");
var ReactDOM = require("react-dom");
var e = React.createElement;

require("./HelpTooltip.css.js");


//ToolTips keeps track of all the tooltips that can be rendered
//It also notifies the GlobalTooltip when something changes
var ToolTips = (function(){
  var tips = {};
  var listener = function(){};
  return {
    setListener: function(fn){
      listener = fn;
    },
    getTip: function(){
      return _.find(tips, function(t){
        return t.show === true && _.isNumber(t.x) && _.isNumber(t.y);
      });
    },
    update: function(id, o){
      if(!_.has(tips, id)){
        tips[id] = {};
      }
      _.assign(tips[id], o, {id: id});
      listener();
    },
    remove: function(id){
      if(_.has(tips, id)){
        delete tips[id];
        listener();
      }
    }
  };
}());


var GlobalTooltip = React.createClass({
  getInitialState: function(){
    //just position it off screen so the height/width stays intact
    return {
      top: -100000,
      left: -100000,
      title: null,
      content: null
    };
  },
  onRef: function(popover_node){
    this.popover_node = popover_node;
  },
  __hideIt: function(){
    var to_show = ToolTips.getTip();
    if(to_show){
      return;//never mind, there is something to show
    }
    //just position it off screen so the height/width stays intact
    this.setState({
      top: -100000,
      left: -100000
    });
  },
  componentWillMount: function(){
    ToolTips.setListener(this.__onTooltips);
    this.__hideIt_direct = this.__hideIt;
    this.__hideIt = _.debounce(this.__hideIt_direct, 500);
  },
  __onTooltips: function(){
    var to_show = ToolTips.getTip();
    if(!to_show){
      this.__hideIt();
      return;
    }
    var top = to_show.y;
    var left = to_show.x;
    if(this.popover_node){
      top -= this.popover_node.offsetHeight;
      left -= this.popover_node.offsetWidth/2;
    }
    this.setState({
      top: top,
      left: left,
      title: to_show.title,
      content: to_show.content
    });
  },
  render: function(){
    var title = this.state.title;
    var content = this.state.content;

    return (
      e("div", {className: 'popover top', ref: this.onRef, style: {
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
        e("div", {className: 'arrow'}),
        title ? e("h3", {className: 'popover-title'}, title) : '',
        content ? e("div", {className: 'popover-content'}, content) : ''
      )
    );
  }
});

var div = document.createElement("DIV")
ReactDOM.render(e(GlobalTooltip), div);
document.body.appendChild(div);

module.exports = dd.createClass({
  getInitialState: function(){
    return {id: _.uniqueId()};
  },
  onClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.__updateTip({show: true, x: e.clientX, y: e.clientY});
  },
  onMouseEnter: function(e){
    this.__updateTip({show: true, x: e.clientX, y: e.clientY});
  },
  onMouseLeave: function(){
    this.__updateTip({show: false});
  },
  componentWillMount: function(){
    this.__updateTip({title: this.props.title, content: this.props.content});
  },
  componentWillReceiveProps: function(next_props){
    this.__updateTip({title: next_props.title, content: next_props.content});
  },
  componentWillUnmount: function(){
    ToolTips.remove(this.state.id);
  },
  __updateTip: function(o){
    ToolTips.update(this.state.id, o);
  },
  render: function(){
    return dd.a({
        className: 'HelpTooltip',
        href: '#',
        style: {position: 'relative'},
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
        onClick: this.onClick
      },
      dd.i({className: "react-bootstrap3-tooltip-icon react-bootstrap3-tooltip-icon-help-circled"})
    );
  }
});
