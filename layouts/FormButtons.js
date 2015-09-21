var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');
var ucfirst = require('ucfirst');

var buttons = [
  ['submit', 'primary', 'Save'],
  ['discard', 'default', 'Undo Changes'],
  ['cancel', 'default', 'Cancel'],
  ['delete', 'danger', 'Delete']
];

var propTypes = {
  scale: React.PropTypes.oneOf(['sm', 'md', 'lg'])
};
_.each(buttons, function(b){
  propTypes['on' + ucfirst(b[0])] = React.PropTypes.func;
  propTypes[b[0] + '_btn_text'] = React.PropTypes.string;
});

module.exports = dd.createClass({
  propTypes: propTypes,
  render: function(){
    var scale = this.props.scale || 'sm';

    var btns = _.map(buttons, function(b){
      var onclick = this.props['on' + ucfirst(b[0])];
      if(b[0] !== 'submit' && !_.isFunction(onclick)){
        return null;
      }
      return dd.button({
          key: b[0],
          type: b[0] === 'submit' ? 'submit' : undefined,
          className: 'btn btn-' + b[1] + ' btn-' + scale,
          onClick: onclick
        },
        this.props[b[0] + '_btn_text'] || b[2]
      );
    }, this);

    if(this.props.right_align){
      btns.reverse();
    }

    return dd.div(this.props.right_align ? {style: {textAlign: "right"}} : {},
      btns
    );
  }
});
