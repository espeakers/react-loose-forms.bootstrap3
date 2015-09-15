var _ = require('lodash');
var dd = require('react-dd');
var FormInputMixin = require('react-loose-forms/FormInputMixin');

var component = dd.createClass({
	mixins: [FormInputMixin],
	__onChange: function(e){
		this.FormInput_newValue(e.target.value);
	},
	render: function(){
		var field = this.props.field;
		var value = this.props.value;

		if(field.read_only){
			return dd.p({className: 'form-control-static'},
				value
			);
		}

		var p = {
			name: field.name,
			type: field.type || 'text',
			value: value || '',
			placeholder: field.placeholder || null,
			className: 'form-control',
			autoFocus: field.autofocus || false,
			onChange: this.__onChange
		};
		if(p.type === "number"){
			_.each(["min", "max", "step"], function(key){
				if(_.has(field, key) && _.isNumber(field[key])){
					p[key] = field[key];
				}
			});
		}
		return dd.input(p);
	}
});

module.exports = {
	component: component
};
