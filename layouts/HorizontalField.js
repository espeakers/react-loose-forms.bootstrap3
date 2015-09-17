var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');
var HelpTooltip = require('./HelpTooltip');

module.exports = dd.createClass({
  propTypes: {
    field: React.PropTypes.object.isRequired,
    error: React.PropTypes.string,
    buildInput: React.PropTypes.func.isRequired,

    scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),
    label_size: React.PropTypes.number,
    input_size: React.PropTypes.number
  },
  render: function(){
    var field = this.props.field;
    var error = this.props.error;
    var buildInput = this.props.buildInput;

    var scale = this.props.scale || 'sm';
    var label_size = _.isNumber(this.props.label_size) ? this.props.label_size : 3;
    var input_size = this.props.input_size || (12 - label_size);

    var field_label = field.label || field.name;
    var tooltip = field.tooltip ? HelpTooltip({title: field_label, content: field.tooltip}) : null;

    return dd.div({className: 'HorizontalField ' + (error ? ' has-error' : '')},
      dd.label({className: 'control-label col-' + scale + '-' + label_size},
        field.type == 'checkbox' ? null : field_label + ' ',
        field.type !== 'checkbox' ? tooltip : null
      ),
      dd.div({className: ' col-' + scale + '-' + input_size},
        buildInput(field),
        field.type == 'checkbox' ? ' ' : null,
        field.type == 'checkbox' ? tooltip : null,
        error ? dd.span({className: 'help-block'}, error) : null,
        field.help_text ? dd.span({className: 'help-block'}, field.help_text) : null
      )
    );
  }
});
