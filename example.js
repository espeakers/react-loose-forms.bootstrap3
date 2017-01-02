var dd = require("react-dd");
var React = require("react");
var ReactDOM = require("react-dom");
var FormMixin = require("react-loose-forms");

require("./bootstrap.min.css");
require("./").install(require("react-loose-forms/InputTypes"));
var input_types = Object.keys(require("./").types);

var FormButtons = require("./layouts/FormButtons");
var ezVerticalFields = require("./layouts/ezVerticalFields");
var ezHorizontalFields = require("./layouts/ezHorizontalFields");
var HorizontalFieldSpot = require("./layouts/HorizontalFieldSpot");

var DaForm = dd.createClass({
  mixins: [FormMixin],
  buildSchema: function(){
    var schema = {};
    input_types.forEach(function(type){
      schema[type] = {
        label: "sample " + type,
        type: type,
        pick_time: true,
        tooltip: "some tooltip huh?",
        options: {
          one: "one 1",
          two: "two 2"
        }
      };
    });
    return schema;
  },
  __reset: function(e){
    e.preventDefault();
    this.Form_reset();
  },
  render: function(){
    var changes_made = this.Form_areChangesMade();
    var use_horizontal = this.props.use_horizontal;
    var btns = FormButtons({
      onDiscard: changes_made ? this.__reset : null,
      submit_btn_text: "submit"
    });
    return dd.form({onSubmit: this.Form_onSubmit},
      use_horizontal
        ? ezHorizontalFields(this)
        : ezVerticalFields(this),

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

var div = document.createElement("DIV")
ReactDOM.render(dd.createClass({
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
})(), div);
document.body.appendChild(div);
