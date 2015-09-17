var dd = require("react-dd");
var React = require("react");
var FormMixin = require("react-loose-forms");

require("./bootstrap.min.css");
require("./").install(require("react-loose-forms/InputTypes"));
var input_types = Object.keys(require("./").types);

var FormButtons = require("./layouts/FormButtons");
var VerticalFields = require("./layouts/VerticalFields");

var DaForm = dd.createClass({
  mixins: [FormMixin],
  buildSchema: function(){
    var schema = {};
    input_types.forEach(function(type){
      schema[type] = {
        label: "sample " + type,
        type: type,
        tooltip: "some tooltip huh?",
        options: {
          one: "one 1",
          two: "two 2"
        }
      };
    });
    return schema;
  },
  render: function(){
    return dd.form({onSubmit: this.Form_onSubmit},
      VerticalFields({
        fields: this.Form_buildSchema(),
        errors: this.state.errors || {},
        buildInput: this.Form_buildInput
      }),
      FormButtons({submit_btn_text: "submit"})
    );
  }
});

React.render(dd.createClass({
  __onSubmit: function(data){
    console.log("__onSubmit", data);
  },
  render: function(){
    return dd.div({className: "container-fluid"},
      dd.div({className: "row"},
        dd.div({className: "col-sm-4"},
          DaForm({onSubmit: this.__onSubmit})
        )
      )
    );
  }
})(), document.body);
