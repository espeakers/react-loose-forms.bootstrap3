var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');

var time_placeholder = 'hh:mm am/pm';

var isDateValid = function(d){
  return _.isDate(d) && !_.isNaN(d.getTime());
};

var hashDate = function(d){
  return isDateValid(d) ? d.toISOString() : null;
};

var formatDate = function(value, pick_date, pick_time){
  var format_parts = [];
  if(pick_date){
    format_parts.push('mm/dd/yyyy');
  }
  var extra_append = '';
  if(pick_time){
    if(isDateValid(value) && value.getHours() === 0 && value.getMinutes() === 0){
      if(pick_date){
        //provide hint that there is a place to enter the time
        extra_append += ' - ' + time_placeholder;
      }else{
        //let the placeholder take over
      }
    }else{
      format_parts.push('- h:MM TT');
    }
  }
  return isDateValid(value)
    ? dateFormat(value, format_parts.join(' ')) + extra_append
    : '';
};

module.exports = dd.createClass({
  getInitialState: function(){
    return {
      text_value: formatDate(this.props.value, this.props.pick_date, this.props.pick_time),
      is_text_invalid: false,
      last_prop_value: hashDate(this.props.value)
    };
  },
  componentWillReceiveProps: function(props){
    var value = props.value;
    var pick_date = props.pick_date;
    var pick_time = props.pick_time;

    if(this.state.last_prop_value !== hashDate(value)){
      this.setState({
        text_value: formatDate(value, pick_date, pick_time),
        is_text_invalid: !!(this.state.is_text_invalid && _.isNull(value)),//set it false if it's a real value now
        last_prop_value: hashDate(value)
      });
    }
  },
  __onChange: function(e){
    var input = e.target.value;
    this.setState({text_value: input});
    this.__debouncedChange();
  },
  __debouncedChange: _.debounce(function(){
    this.__parseInputToDate();
  }, 3 * 1000),
  __onBlur: function(e){
    this.__parseInputToDate();
  },
  componentWillMount: function(){
    var self = this;

    self.__parseInputToDate = (function(){
      var last_input_checked = "";

      return function(){
        var text_value = self.state.text_value;
        if(last_input_checked === text_value){
          return;//already checked this
        }
        last_input_checked = text_value;
        var d = new Date(text_value);

        //try different formats
        if(!isDateValid(d)){
          d = new Date(text_value.replace(/\-/g, " "));
        }
        if(!isDateValid(d)){
          d = new Date(text_value.replace(/am\/pm/i, " ").replace(/\-/g, " ").replace(/m|h/g, "0"));
        }

        //final verdict if it's valid or not
        if(isDateValid(d)){
          self.props.onDateSet(d);
        }else{
          self.props.onDateSet(null);
          self.setState({is_text_invalid: true, text_value: ''});

          //auto hide the message
          setTimeout(function(){
            if(self.state.is_text_invalid){
              self.setState({is_text_invalid: false});
            }
          }, 3 * 1000);
        }
      };
    }());
  },
  render: function(){
    var pick_date = this.props.pick_date;
    var pick_time = this.props.pick_time;
    var placeholder = this.props.placeholder;

    var text_value = this.state.text_value;
    var is_text_invalid = this.state.is_text_invalid;

    var placeholder_parts = [];
    if(pick_date){
      placeholder_parts.push('mm/dd/yyyy');
    }
    if(pick_time){
      placeholder_parts.push(time_placeholder);
    }
    return dd.span({className: is_text_invalid ? 'has-error' : null},
      dd.input({
        type: 'text',
        className: 'form-control',
        placeholder: placeholder || placeholder_parts.join(' - '),
        value: text_value,
        onChange: this.__onChange,
        onBlur: this.__onBlur
      }),
      is_text_invalid ? dd.div({className: 'popover bottom', ref: 'popover', style: {
          display: 'block',
          top: 28,

          //normalizing styles (so parent font styling doesn't mess with this)
          fontSize: 14,
          color: 'black',
          textAlign: 'left',
          fontWeight: 'normal'
        }},
        dd.div({className: 'arrow'}),
        dd.div({className: 'popover-content'},
          'Try again using the suggested format, or use the buttons to the right'
        )
      ) : null
    );
  }
});
