var dd = require('react-dd');
var React = require('react');
var HelpTooltip = require('./HelpTooltip');

module.exports = dd.createClass({
  propTypes: {
    field: React.PropTypes.object.isRequired,
    error: React.PropTypes.string,
    buildInput: React.PropTypes.func.isRequired
  },
  render: function(){
    var field = this.props.field;
    var error = this.props.error;
    var buildInput = this.props.buildInput;

    var field_label = field.label || field.name;
    var tooltip = field.tooltip ? HelpTooltip({title: field_label, content: field.tooltip}) : null;

    return dd.div({className: 'VerticalField form-group ' + (error ? ' has-error' : '')},
      field.type !== 'checkbox' && !!(tooltip || field.label) ? dd.label({className: 'control-label'},
        field_label + ' ', tooltip
      ) : null,
      buildInput(field),
      field.type == 'checkbox' ? ' ' : null,
      field.type == 'checkbox' ? tooltip : null,
      error ? dd.span({className: 'help-block'}, error) : null,
      field.help_text ? dd.span({className: 'help-block'}, field.help_text) : null
    );
  }
});
