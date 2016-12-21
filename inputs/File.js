var dd = require('react-dd');

var component = dd.createClass({
  __onChange: function(e){
    this.props.onChange(e.target.files);
  },
  render: function(){
    var field = this.props.field;
    var value = this.props.value;

    if(typeof FileList === 'undefined'){
      return dd.p({className: 'form-control-static text-danger'},
        'Your browser is outdated and will not work with this file upload.'
      );
    }
    if(field.read_only){
      return dd.p({className: 'form-control-static'},
        value
      );
    }
    return dd.input({
      type: 'file',
      disabled: field.disabled ? "disabled" : null,
      name: field.name,
      className: 'form-control',
      style: {border: 0, boxShadow: 'none', paddingLeft: 0, paddingRight: 0},
      onChange: this.__onChange,
      multiple: field.multiple === true ? true : false
    });
  }
});

module.exports = {
  component: component,
  validate: function(value){
    return ((value instanceof FileList) && value.length === 1) || 'You must select a file to upload';
  }
};
