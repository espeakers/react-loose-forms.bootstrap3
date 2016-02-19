var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');
var HoverMixin = require('react-hover-mixin');
var wrapPreventDefault = require("./wrapPreventDefault");

require('./index.less.js');
var DatePickerCalendar = require('./DatePickerCalendar');
var DateTypeIn = require('./DateTypeIn');
var TimePicker = require('./TimePicker');

var component = dd.createClass({
  mixins: [HoverMixin],
  __onChange: function(date){
    this.props.onChange(_.isDate(date) ? date : null);
  },

  ////////////////////////////////////////////////////////////////////////
  getInitialState: function(){
    return {show_calendar: false, show_timepicker: false};
  },
  __toggleCalendar: wrapPreventDefault(function(){
    this.setState({show_calendar: !this.state.show_calendar, show_timepicker: false});
  }),
  __toggleTimepicker: wrapPreventDefault(function(){
    this.setState({show_calendar: false, show_timepicker: !this.state.show_timepicker});
  }),
  __onDatePicked: function(year, month, day){
    var d = _.isDate(this.props.value) ? _.cloneDeep(this.props.value) : new Date(0, -1, 0, 0, 0, 0, 0);
    d.setFullYear(year);
    d.setMonth(month - 1, day);//You must set the date in setMonth b/c otherwise they will mess with each other in surprising ways (what the heck javascript!)
    this.__onChange(d);
    this.setState({show_calendar: false});
  },
  __onTimeChanged: function(hours, minute){
    var d = _.isDate(this.props.value) ? _.cloneDeep(this.props.value) : new Date();
    d.setHours(hours);
    d.setMinutes(minute);
    this.__onChange(d);
  },
  __onDateSet: function(new_date){
    this.__onChange(_.cloneDeep(new_date));
  },
  hoverable_onUserLeftHoverable: function(){
    if(this.state.show_calendar || this.state.show_timepicker){//only setState if needed
      this.setState({show_calendar: false, show_timepicker: false});
    }
  },
  __stopClick: wrapPreventDefault(_.noop),
  render: function(){
    var field = this.props.field;
    var value = this.props.value;
    var show_calendar = this.state.show_calendar;
    var show_timepicker = this.state.show_timepicker;

    var pick_date = _.has(field, 'pick_date') ? !!field.pick_date : true;//by default be a date picker
    var pick_time = !!field.pick_time;//by default don't pick time

    if(field.read_only){
      var format_parts = [];
      if(pick_date){
        format_parts.push('mm/dd/yyyy');
      }
      if(pick_time){
        if(_.isDate(value) && value.getHours() === 0 && value.getMinutes() === 0){
        }else{
          format_parts.push('- h:MM TT');
        }
      }
      return dd.p({className: 'form-control-static'},
        _.isDate(value) ? dateFormat(value, format_parts.join(' ')) : ''
      );
    }

    return dd.div({
        className: 'react-loose-forms-bs3-date input-group',
        onClick: this.__toggleCalendar,
        onMouseEnter: this.hoverable_onMouseEnter,
        onMouseLeave: this.hoverable_onMouseLeave
      },
      DateTypeIn({pick_date: pick_date, pick_time: pick_time, value: value, onDateSet: this.__onDateSet, placeholder: field.placeholder}),
      dd.span({
          className: 'input-group-btn'
            + (show_calendar || show_timepicker ? ' open' : '')
            + (field.dropup ? ' dropup' : ''),
          style: {verticalAlign: 'top'}
        },
        pick_date ? dd.button({type: 'button', className: 'btn btn-default', onClick: this.__toggleCalendar},
          dd.i({className: 'react-loose-forms-bs3-date-icon react-loose-forms-bs3-date-icon-calendar'})
        ) : null,
        pick_time ? dd.button({type: 'button', className: 'btn btn-default', onClick: this.__toggleTimepicker},
          dd.i({className: 'react-loose-forms-bs3-date-icon react-loose-forms-bs3-date-icon-clock'})
        ) : null,
        show_calendar || show_timepicker ? dd.div({
            className: 'dropdown-menu pull-right',
            onClick: this.__stopClick
          },
          show_calendar ? DatePickerCalendar({field: field, value: value, onDatePicked: this.__onDatePicked}) : null,
          show_timepicker ? TimePicker({field: field, value: value, onTimeChanged: this.__onTimeChanged}) : null
        ) : null
      )
    );
  }
});

module.exports = {
  component: component,
  validate: function(value){
    if(!_.isDate(value)){
      return 'Please enter your date';
    }
    return true;
  }
};
