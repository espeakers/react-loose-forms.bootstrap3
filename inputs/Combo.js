var _ = require("lodash");
var dd = require("react-dd");
var HoverMixin = require("react-hover-mixin");

var component = dd.createClass({
  mixins: [HoverMixin],
  __onChange: function(e){
    this.props.onChange(e.target.value);
  },
  getInitialState: function(){
    return {dd_open: false};
  },
  __toggleDropDown: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({dd_open: !this.state.dd_open});
  },
  hoverable_onUserLeftHoverable: function(){
    if(this.state.dd_open){//only setState if needed
      this.setState({dd_open: false});
    }
  },
  __itemSelected: function(value){
    var self = this;
    return function(e){
      e.preventDefault();
      e.stopPropagation();
      if(_.isFunction(self.props.onSelectTransform)){
        value = self.props.onSelectTransform(value);
      }
      self.setState({dd_open: false});
      self.props.onChange(value);
    };
  },
  render: function(){
    var field = this.props.field;
    var value = this.props.value;

    if(field.read_only){
      return dd.p({className: "form-control-static"},
        _.has(field.options, value) ? field.options[value] : value
      );
    }

    var type_in = dd.input({
      type: "text",
      name: field.name,
      value: value || "",
      onChange: this.__onChange,
      className: "form-control",
      placeholder: field.placeholder || null
    });
    if(_.isEmpty(field.options)){
      return type_in;
    }
    return dd.div({className: "input-group"},
      type_in,
      dd.span({
          className: "input-group-btn" + (this.state.dd_open ? " open" : ""),
          onMouseEnter: this.hoverable_onMouseEnter,
          onMouseLeave: this.hoverable_onMouseLeave
        },
        dd.button({className: "btn btn-default", onClick: this.__toggleDropDown},
          dd.span({className: "caret"})
        ),
        dd.ul({className: "dropdown-menu pull-right", style: {overflowY: "auto", maxHeight: 150}},
          _.map(field.options, function(name, val){
            return dd.li({key: val}, dd.a({href: "#", onClick: this.__itemSelected(val)}, name));
          }, this)
        )
      )
    );
  }
});

module.exports = {
  component: component
};
