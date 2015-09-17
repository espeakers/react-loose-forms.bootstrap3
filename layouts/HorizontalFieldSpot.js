var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');

module.exports = dd.createClass({
  propTypes: {
    scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),
    label_size: React.PropTypes.number,
    input_size: React.PropTypes.number
  },
  render: function(){
    var scale = this.props.scale || 'sm';
    var label_size = _.isNumber(this.props.label_size) ? this.props.label_size : 3;
    var input_size = this.props.input_size || (12 - label_size);

    return dd.div({className: 'HorizontalFields'},//hack to fix layout
      dd.div({className: 'form-group'},
        dd.label({className: 'control-label col-' + scale + '-' + label_size}, ' '),
        dd.div({className: 'col-' + scale + '-' + input_size},
          this.props.children
        )
      )
    );
  }
});
