var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');
var VerticalField = require("./VerticalField");

//read why vertical alignment of fields and labels is the best form layout
//http://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php

module.exports = dd.createClass({
  propTypes: {
    fields: React.PropTypes.object.isRequired,
    errors: React.PropTypes.object.isRequired,
    buildInput: React.PropTypes.func.isRequired,

    scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),
    layout: React.PropTypes.array
  },
  render: function(){
    var fields = this.props.fields;
    var errors = this.props.errors;
    var buildInput = this.props.buildInput;

    var scale = this.props.scale || 'sm';
    var layout = this.props.layout;
    if(!layout || !_.isArray(layout)){
      layout = _.map(fields, function(f, name){
        return [name];
      });
    }

    return dd.div({className: 'VerticalFields'},
      _.map(layout, function(row, i){
        if(!_.isArray(row) || row.length === 0 || row.length > 12){
          return dd.div({key: i});
        }
        var col_size = Math.floor(12 / row.length);

        return dd.div({key: i, className: 'row'},
          _.map(row, function(name, i){
            return dd.div({key: i, className: 'col-' + scale + '-' + col_size},
              _.has(fields, name) ? VerticalField({
                field: fields[name],
                error: errors[name],
                buildInput: buildInput
              }) : null
            );
          })
        );
      })
    );
  }
});
