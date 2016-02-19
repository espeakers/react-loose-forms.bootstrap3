var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');
var wrapPreventDefault = require("./wrapPreventDefault");

var icon_prefix = 'react-loose-forms-bs3-date-icon';
var icon_classes = {
  angle_up: icon_prefix + ' ' + icon_prefix + '-angle-up',
  angle_down: icon_prefix + ' ' + icon_prefix + '-angle-down'
};

module.exports = dd.createClass({
  __increment: function(field, inc){
    var self = this;
    return wrapPreventDefault(function(){
      var onTimeChanged = self.props.onTimeChanged;
      var d = _.isDate(self.props.value) ? _.cloneDeep(self.props.value) : new Date(0, -1, 0, 0, 0, 0, 0);

      //save these so we ensure adding a bunch of hours doesn't change the day
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      if(field === 'hour'){
        d.setHours(d.getHours() + inc);
      }else if(field === 'min'){
        d.setMinutes(d.getMinutes() + inc);
      }
      d.setFullYear(year);
      d.setMonth(month);
      d.setDate(day);

      onTimeChanged(d.getHours(), d.getMinutes());
    });
  },
  __onTypeHour: function(e){
  },
  __onTypeMinutes: function(e){
  },
  __onTypeAMPM: function(e){
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
            dd.td(null, dd.input({type: 'text', className: 'form-control input-sm', placeholder: 'HH', maxLength: 2, value: hours, onChange: this.__onTypeHour, disabled: 'disabled'})),
            dd.td(null, ' : '),
            dd.td(null, dd.input({type: 'text', className: 'form-control input-sm', placeholder: 'MM', maxLength: 2, value: minutes, onChange: this.__onTypeMinutes, disabled: 'disabled'})),
            dd.td(null, ' : '),
            dd.td(null, dd.input({type: 'text', className: 'form-control input-sm', placeholder: 'AM/PM', maxLength: 2, value: ampm, onChange: this.__onTypeAMPM, disabled: 'disabled'}))
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
