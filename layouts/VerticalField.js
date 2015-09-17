var dd = require('react-dd');
var React = require('react');

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

    return dd.div({className: 'VerticalField form-group ' + (error ? ' has-error' : '')},
      field.type !== 'checkbox' && !!field.label ? dd.label({className: 'control-label'},
        field_label + ' '
      ) : null,
      buildInput(field),
      field.type == 'checkbox' ? ' ' : null,
      error ? dd.span({className: 'help-block'}, error) : null,
      field.help_text ? dd.span({className: 'help-block'}, field.help_text) : null
    );
  }
});
