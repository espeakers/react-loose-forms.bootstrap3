var dd = require('react-dd');
var FormInputMixin = require('react-loose-forms/FormInputMixin');

var component = dd.createClass({
	mixins: [FormInputMixin],
	__onChange: function(e){
		this.FormInput_newValue(!!e.target.checked);
	},
	render: function(){
		var field = this.props.field;
		var value = this.props.value;

		return dd.label({style: {fontWeight: 'normal'}},
			dd.input({
				type: 'checkbox',
				checked: !!value,
				name: field.name,
				onChange: this.__onChange,
				disabled: field.read_only ? 'disabled' : null
			}),
			' ',
			field.label
		);
	}
});

module.exports = {
	component: component,
	validate: function(){
		return true;//can't go wrong with a checkbox
	}
};
