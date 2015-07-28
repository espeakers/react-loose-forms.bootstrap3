var React = require('react');
var FormInputMixin = require('react-loose-forms/FormInputMixin');

var component = React.createFactory(React.createClass({
	mixins: [FormInputMixin],
	__onChange: function(e){
		this.FormInput_newValue(e.target.value);
	},
	render: function(){
		var field = this.props.field;
		var value = this.props.value;

		return React.createElement("input", {
			name: field.name,
			type: field.type || 'text',
			value: value || '',
			className: 'form-control',
			onChange: this.__onChange,
			placeholder: field.placeholder || null
		});
	}
}));

module.exports = {
	component: component
};
