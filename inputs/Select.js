var _ = require('lodash');
var dd = require('react-dd');
var FormInputMixin = require('react-loose-forms/FormInputMixin');

var placeholder_value = '__some$random$uuid__';

var component = dd.createClass({
	mixins: [FormInputMixin],
	__onChange: function(e){
		var field = this.props.field;
		var new_value = e.target.value;
		this.FormInput_newValue(_.has(field.options, new_value) ? new_value : null);
	},
	render: function(){
		var field = this.props.field;
		var value = _.has(field.options, this.props.value) ? this.props.value : (field.placeholder ? placeholder_value : '');

		if(field.read_only){
			return dd.p({className: 'form-control-static'},
				_.has(field.options, value) ? field.options[value] : value
			);
		}

		var options = _.pairs(field.options);
		if(!field.dont_sort_options){
			options = _.sortBy(options, function(option){
				return _.isString(option[1]) ? option[1].toUpperCase() : 0;
			});
		}

		return dd.select({
				name: field.name,
				value: value,
				onChange: this.__onChange,
				disabled: field.disabled ? 'disabled' : null,
				className: 'form-control' + (field.disabled ? ' disabled' : '')
			},
			dd.option({value: placeholder_value}, field.placeholder ? field.placeholder : ''),
			_.map(options, function(option){
				return dd.option({value: option[0], key: option[0]}, option[1]);
			})
		);
	}
});

module.exports = {
	component: component,
	validate: function(value, field){
		if(!_.has(field.options, value)){
			return 'Please make a selection';
		}
		return true;
	}
};
