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
			return dd.p({className: 'form-control-static', style: {whiteSpace: 'pre-wrap'}},
				value
			);
		}

		return dd.textarea({
			rows: field.rows > 0 ? field.rows : 3,
			placeholder: field.placeholder || null,
			className: 'form-control',
			value: value || '',
			name: field.name,
			onChange: this.__onChange
		});
	}
});

module.exports = {
	component: component
};
