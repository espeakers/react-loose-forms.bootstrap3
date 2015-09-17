var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');
var wrapPreventDefault = require("./wrapPreventDefault");

var getMonthName = function(month_input, use_short){
  var month = parseInt(month_input);
  if(!_.isNumber(month) || _.isNaN(month)){
    return month_input;
  }
  month = (month - 1) % 12;
  month = month < 0 ? 12 + month : month;
  return _.isNumber(month) ? dateFormat.i18n.monthNames[!use_short ? month + 12 : month] : month;
};

var getDayOfWeek = function(day_input, use_short){
  var day = parseInt(day_input);
  if(!_.isNumber(day) || _.isNaN(day)){
    return day_input;
  }
  day = (day - 1) % 7;
  day = day < 0 ? 7 + day : day;
  return dateFormat.i18n.dayNames[!use_short ? day + 7 : day];
};

var getNDaysInMonth = function(year, month){
  return [31, ((((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

var buildCalendarWeeks = function(year, month, must_be_six_weeks){
  var d = new Date(year, month - 1, 1, 0, 0, 0, 0);
  var daysInPrevMonth = d.getMonth() === 0 ? getNDaysInMonth(d.getFullYear() - 1, 11) : getNDaysInMonth(d.getFullYear(), d.getMonth() - 1);
  var daysInThisMonth = getNDaysInMonth(d.getFullYear(), d.getMonth());
  var dayOfWeekStartsOn = d.getDay();
  var dateI = 1;
  var i;
  var weeks = [];

  var curWeek = [];
  for(i = 0; i < dayOfWeekStartsOn; i++){
    curWeek.push({date: daysInPrevMonth - (dayOfWeekStartsOn - i) + 1, out_of_month: true});
  }
  while(dateI <= daysInThisMonth){
    if(curWeek.length === 7){
      weeks.push(curWeek);
      curWeek = [];
    }
    curWeek.push({date: dateI});
    dateI++;
  }
  if(curWeek.length > 0){
    var daysToAdd = 7 - curWeek.length;
    for(i = 0; i < daysToAdd; i++){
      curWeek.push({date: i + 1, out_of_month: true});
    }
    weeks.push(curWeek);
    if(must_be_six_weeks){
      while(weeks.length < 6){
        curWeek = [];
        var j;
        for(j = 0; j < 7; j++){
          curWeek.push({date: i + 1, out_of_month: true});
          i++;
        }
        weeks.push(curWeek);
      }
    }
  }
  return weeks;
};

module.exports = dd.createClass({
  getInitialState: function(){
    var today = new Date();
    if(_.isDate(this.props.value)){
      today = this.props.value;
    }else{
      var field = this.props.field;
      var start = _.isDate(field.valid_range && field.valid_range.start) ? field.valid_range.start : null;
      var stop = _.isDate(field.valid_range && field.valid_range.stop) ? field.valid_range.stop : null;
      if(start && ((start.getFullYear() > today.getFullYear()) || (start.getMonth() > today.getMonth()))){
        today = start;
      }else if(stop && ((stop.getFullYear() < today.getFullYear()) || (stop.getMonth() < today.getMonth()))){
        today = stop;
      }
    }
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1
    };
  },
  __incMonth: function(inc){
    var year = this.state.year;
    var month = this.state.month;
    var d = new Date(year, month - 1, 1);
    d.setMonth(d.getMonth() + inc);
    this.setState({year: d.getFullYear(), month: d.getMonth() + 1});
  },
  __nextMonth: wrapPreventDefault(function(){
    this.__incMonth(1);
  }),
  __prevMonth: wrapPreventDefault(function(){
    this.__incMonth(-1);
  }),
  __onDayClick: function(day){
    var self = this;
    return wrapPreventDefault(function(){
      var year = self.state.year;
      var month = self.state.month;
      self.props.onDatePicked(year, month, day);
    });
  },
  render: function(){
    var self = this;
    var field = self.props.field;
    var year = self.state.year;
    var month = self.state.month;
    var selected_day = getDayIfMatches(self.props.value, month, year);

    var start_day = getDayIfMatches(field.valid_range && field.valid_range.start, month, year);
    var stop_day = getDayIfMatches(field.valid_range && field.valid_range.stop, month, year);

    var weeks = buildCalendarWeeks(year, month, true);
    return dd.div({className: 'DatePickerCalendar'},
      dd.table(null,
        dd.thead(null,
          dd.tr(null,
            dd.th({colSpan: 7, className: 'month'},
              start_day > 0 ? null : dd.button({className: 'btn btn-default btn-sm pull-left', onClick: this.__prevMonth},
                dd.i({className: 'fa fa-angle-left'})
              ),
              getMonthName(month) + ' ' + year,
              stop_day > 0 ? null : dd.button({className: 'btn btn-default btn-sm pull-right', onClick: this.__nextMonth},
                dd.i({className: 'fa fa-angle-right'})
              )
            )
          ),
          dd.tr(null,
            _.map([1, 2, 3, 4, 5, 6, 7], function(d){
              return dd.th({key: d, className: 'dow'}, getDayOfWeek(d, true));
            })
          )
        ),
        dd.tbody(null,
          _.map(weeks, function(week, i){
            return dd.tr({key: i},
              _.map(week, function(day, i){
                var classes = [];
                var onClick = null;
                if(day.out_of_month || day.date < start_day || (stop_day > 0 && day.date > stop_day)){
                  classes.push('out');
                }else{
                  classes.push('clickable');
                  onClick = self.__onDayClick(day.date);
                  if(day.date == selected_day){
                    classes.push('selected');
                  }
                }
                return dd.td({key: i},
                  dd.span({className: classes.join(' '), onClick: onClick}, day.date)
                );
              })
            );
          })
        )
      )
    );
  }
});


var getDayIfMatches = function(date, month, year){
  if(_.isDate(date)){
    if(date.getFullYear() === year && date.getMonth() + 1 === month){
      return date.getDate();
    }
  }
  return -1;
};
