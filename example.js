var dd = require("react-dd");
var React = require("react");
var FormMixin = require("react-loose-forms");

require("./bootstrap.min.css");
require("./").install(require("react-loose-forms/InputTypes"));
var input_types = Object.keys(require("./").types);

var FormButtons = require("./layouts/FormButtons");
var VerticalFields = require("./layouts/VerticalFields");
var HorizontalFields = require("./layouts/HorizontalFields");
var HorizontalFieldSpot = require("./layouts/HorizontalFieldSpot");

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
    var use_horizontal = this.props.use_horizontal;
    var fields_config = {
        fields: this.Form_buildSchema(),
        errors: this.state.errors || {},
        buildInput: this.Form_buildInput
    };
    var btns = FormButtons({submit_btn_text: "submit"});
    return dd.form({onSubmit: this.Form_onSubmit},
      use_horizontal
        ? HorizontalFields(fields_config)
        : VerticalFields(fields_config),

      use_horizontal
        ? HorizontalFieldSpot(null, btns)
        : btns,

      dd.div({className: "clearfix"}),
      dd.pre(null,
        "this.state = ",
        JSON.stringify(this.state, false, 2)
      )
    );
  }
});

React.render(dd.createClass({
  getInitialState: function(){
    return {use_horizontal: false};
  },
  __onSubmit: function(data){
    console.log("__onSubmit", data);
  },
  __toggleLayout: function(e){
    e.preventDefault();
    this.setState({use_horizontal: !this.state.use_horizontal});
  },
  render: function(){
    return dd.div({className: "container-fluid"},
      dd.div({className: "row"},
        dd.div({className: "col-sm-4"},
          dd.h1(null, "Example ", dd.small(null, dd.a({href: "#", onClick: this.__toggleLayout}, "change layout"))),
          DaForm({onSubmit: this.__onSubmit, use_horizontal: this.state.use_horizontal})
        )
      )
    );
  }
})(), document.body);
