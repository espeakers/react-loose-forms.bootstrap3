var _ = require('lodash');
var dd = require('react-dd');

var strToNum = function(s){
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
};

var numToStr = function(n){
  if(!_.isNumber(n) || _.isNaN(n)){
    return '0';
  }
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

var propVToText = function(v){
  return _.isNumber(v) && !_.isNaN(v) && v !== 0
    ? numToStr(v)
    : ""
};

var component = dd.createClass({
  getInitialState: function(){
    return {text: propVToText(this.props.value)};
  },
  componentWillReceiveProps: function(next){
    if(this.props.value !== next.value){
      this.setState({text: propVToText(next.value)});
    }
  },
  __onChange: function(e){
    this.setState({text: e.target.value});
  },
  __onBlur: function(e){
    this.props.onChange(strToNum(e.target.value));
  },
  render: function(){
    var field = this.props.field;
    var value = this.props.value;
    var text = this.state.text;

    if(field.read_only){
      return dd.p({className: 'form-control-static'},
        text
      );
    }

    var p = {
      name: field.name,
      disabled: field.disabled ? "disabled" : null,
      type: 'text',
      value: text,
      placeholder: field.placeholder || null,
      className: 'form-control',
      autoFocus: field.autofocus || false,
      onBlur: this.__onBlur,
      onChange: this.__onChange
    };
    return dd.div({className: 'input-group'},
        dd.span({className: 'input-group-addon'}, '$ USD'),
        dd.input(p)
    );
  }
});

module.exports = {
  component: component
};
