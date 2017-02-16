var _ = require('lodash');
var dd = require('react-dd');
var dateFormat = require('dateformat');

require('./index.less');

var component = dd.createClass({
  render: function(){
    var field = this.props.field;
    var value = this.props.value;

    var initial_date = field.initial_date ? field.initial_date : dateFormat(new Date(), "m/dd/yyyy");
    var initial_name = field.initial_name ? field.initial_name : "Name";

    return (
        dd.div(
            {className: "form-group signature-group row"},
            dd.div({className: "col-sm-5 signature-input-holder"},
                dd.div({className: "input"}, initial_name),
                dd.span({className: "help-block"}, "Name")
            ),
            dd.div({className: "col-sm-2 signature-input-holder"},
                dd.div(null,
                    dd.input({
                        name: field.name,
                        disabled: field.disabled ? "disabled" : null,
                        type: field.type || 'text',
                        value: value || '',
                        placeholder: field.placeholder || null,
                        className: 'form-control',
                        autoFocus: field.autofocus || false,
                        onChange: this.__onChange
                    })
                ),
                dd.span({className: "help-block"}, "Initials")
            ),
            dd.div({className: "col-sm-5 signature-input-holder"},
                dd.div({className: "input"},
                    initial_date
                ),
                dd.span({className: "help-block"}, "Date")
            )
            // ),
            // dd.div({className: "clearfix"})
        )
    );
  }
});

module.exports = {
  component: component,
  validate: function(value){
    if(_.isString(value) && str.trim().length == 0){
        return 'Please enter your initials';
    }
    return true;
  }
};
