var _ = require('lodash');
var dd = require('react-dd');

module.exports = {
  component: dd.createClass({
    render: function(){
      var field = this.props.field;
      var value = this.props.value;

      return dd.p({className: 'form-control-static'},
        field.options && _.has(field.options, value) ? field.options[value] : value
      );
    }
  }),
  validate: function(){
    return true;
  }
};
