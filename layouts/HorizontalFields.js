var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');
var HorizontalField = require("./HorizontalField");

module.exports = dd.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object.isRequired,
    buildInput: React.PropTypes.func.isRequired,

    scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),
    label_size: React.PropTypes.number,
    input_size: React.PropTypes.number
  },
  render: function(){
    var fields = this.props.fields;
    var errors = this.props.errors;
    var buildInput = this.props.buildInput;

    var scale = this.props.scale || 'sm';
    var label_size = _.isNumber(this.props.label_size) ? this.props.label_size : 3;
    var input_size = this.props.input_size || (12 - label_size);

    var layout = this.props.layout;
    if(!layout || !_.isArray(layout)){
      layout = _.map(fields, function(f, name){
        return [name];
      });
    }

    return dd.div({className: 'HorizontalFields'},
      _.map(layout, function(row, i){
        return dd.div({key: i, className: 'form-group'},
          _.map(row, function(name, j){
            return HorizontalField({
              key: j,
              field: fields[name],
              error: errors[name],
              buildInput: buildInput,

              scale: scale,
              label_size: label_size,
              input_size: row.length > 1 ? (input_size - label_size) / 2 : input_size
            });
          })
        );
      })
    );
  }
});
