var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');
var wrapPreventDefault = require("./wrapPreventDefault");

var icon_prefix = 'react-loose-forms-bs3-date-icon';
var icon_classes = {
  angle_up: icon_prefix + ' ' + icon_prefix + '-angle-up',
  angle_down: icon_prefix + ' ' + icon_prefix + '-angle-down'
};

var TypeIn = dd.createClass({
  getInitialState: function(){
    return {text_value: this.props.value};
  },
  componentWillReceiveProps: function(next_props){
    if(this.props.value !== next_props.value){
      this.setState({text_value: next_props.value});
    }
  },
  __onChange: function(e){
    this.setState({text_value: e.target.value});
  },
  __onBlur: function(){
    this.props.onValue(this.state.text_value);
  },
  __onKeyUp: function(e){
    if(e.keyCode == 13){//enter key
      e.preventDefault();
      this.props.onValue(this.state.text_value);
    }
  },
  render: function(){
    return dd.input({
      type: 'text',
      className: 'form-control input-sm',
      placeholder: this.props.placeholder,
      maxLength: 2,
      value: this.state.text_value,
      onBlur: this.__onBlur,
      onKeyUp: this.__onKeyUp,
      onChange: this.__onChange
    });
  }
});

module.exports = dd.createClass({
  __changeTime: function(doChange){
    var onTimeChanged = this.props.onTimeChanged;
    var d = _.isDate(this.props.value)
      ? _.cloneDeep(this.props.value)
      : new Date(0, -1, 0, 0, 0, 0, 0);

    //save these so we ensure adding a bunch of hours doesn't change the day
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    var changes = doChange(d.getHours(), d.getMinutes());
    if(_.isNumber(changes.hour) && !_.isNaN(changes.hour)){
      d.setHours(changes.hour);
    }
    if(_.isNumber(changes.minute) && !_.isNaN(changes.minute)){
      d.setMinutes(changes.minute);
    }
    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(day);

    onTimeChanged(d.getHours(), d.getMinutes());
  },
  __increment: function(field, inc){
    var self = this;
    return wrapPreventDefault(function(){
      self.__changeTime(function(hour, minute){
        if(field === 'hour'){
          return {hour: hour + inc};
        }else if(field === 'min'){
          return {minute: minute + inc};
        }
      });
    });
  },
  __onTypeHour: function(str){
    var new_hour = _.parseInt(str.replace(/[^[0-9]]/g, ""), 10) || 0;
    this.__changeTime(function(){
      return {hour: new_hour};
    });
  },
  __onTypeMinutes: function(str){
    var new_minute = _.parseInt(str.replace(/[^[0-9]]/g, ""), 10) || 0;
    this.__changeTime(function(){
      return {minute: new_minute};
    });
  },
  __onTypeAMPM: function(ampm){
    this.__changeTime(function(hour){
      var inc = 0;
      if(/am/i.test(ampm)){
        inc += hour < 12 ? 0 : 12;
      }else if(/pm/i.test(ampm)){
        inc += hour < 12 ? 12 : 0;
      }
      return {hour: hour + inc};
    });
  },
  render: function(){
    var self = this;
    var value = _.isDate(this.props.value) ? this.props.value : null;

    var hours = value ? dateFormat(value, 'h') : '';
    var minutes = value ? dateFormat(value, 'MM') : '';
    var ampm = value ? dateFormat(value, 'TT') : '';

    var incBtn = function(field, inc){
      var onClick = self.__increment(field, inc);
      return dd.button({className: 'btn btn-default', onClick: onClick},
        dd.i({
          className: inc > 0 ? icon_classes.angle_up : icon_classes.angle_down
        })
      );
    };

    return dd.div({className: 'TimePicker'},
      dd.table(null,
        dd.tbody(null,
          dd.tr(null,
            dd.td(null, incBtn('hour', 1)),
            dd.td(),
            dd.td(null, incBtn('min', 5)),
            dd.td(),
            dd.td(null, incBtn('hour', 12))
          ),
          dd.tr(null,
            dd.td(null, TypeIn({
              placeholder: 'HH',
              value: hours,
              onValue: this.__onTypeHour
            })),
            dd.td(null, ' : '),
            dd.td(null, TypeIn({
              placeholder: 'MM',
              value: minutes,
              onValue: this.__onTypeMinutes
            })),
            dd.td(null, ' : '),
            dd.td(null, TypeIn({
              placeholder: 'AM/PM',
              value: ampm,
              onValue: this.__onTypeAMPM
            }))
          ),
          dd.tr(null,
            dd.td(null, incBtn('hour', -1)),
            dd.td(),
            dd.td(null, incBtn('min', -5)),
            dd.td(),
            dd.td(null, incBtn('hour', -12))
          )
        )
      )
    );
  }
});
