var _ = require('lodash');
var dd = require('react-dd');
var React = require('react');

//read why vertical alignment of fields and labels is the best form layout
//http://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php

module.exports = dd.createClass({
	propTypes: {
		fields: React.PropTypes.object.isRequired,
		errors: React.PropTypes.object.isRequired,
		buildInput: React.PropTypes.func.isRequired,

		scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),
		layout: React.PropTypes.array
	},
	render: function(){
		var fields = this.props.fields;
		var errors = this.props.errors;
		var buildInput = this.props.buildInput;

		var scale = this.props.scale || 'sm';
		var layout = this.props.layout;
		if(!layout || !_.isArray(layout)){
			layout = _.map(fields, function(f, name){
				return [name];
			});
		}


		return dd.div({className: 'VerticalFields'},
			_.map(layout, function(row, i){
				if(!_.isArray(row) || row.length === 0 || row.length > 12){
					return dd.div({key: i});
				}
				var col_size = Math.floor(12 / row.length);

				return dd.div({className: 'row', key: i},
					_.map(row, function(name, i){
						return dd.div({key: i, className: 'col-' + scale + '-' + col_size},
							VerticalField({
								field: fields[name],
								error: errors[name],
								buildInput: buildInput
							})
						);
					})
				);
			})
		);
	}
});

var VerticalField = dd.createClass({
	propTypes: {
		field: React.PropTypes.object.isRequired,
		error: React.PropTypes.object.isRequired,
		buildInput: React.PropTypes.func.isRequired
	},
	render: function(){
		var field = this.props.field;
		var error = this.props.error;
		var buildInput = this.props.buildInput;

		if(!field){
			return dd.div();//render a placeholder with whatever name is (i.e. can pass in a component)
		}

		var field_label = field.label || field.name;

		return dd.div({className: 'VerticalField form-group ' + (error ? ' has-error' : '')},
			field.type !== 'checkbox' && !!field.label ? dd.label({className: 'control-label'},
				field_label + ' '
			) : null,
			buildInput(field),
			field.type == 'checkbox' ? ' ' : null,
			error ? dd.span({className: 'help-block'}, error) : null,
			field.help_text ? dd.span({className: 'help-block'}, field.help_text) : null
		);
	}
});

module.exports.FormButtons = dd.createClass({
	propTypes: {
		scale: React.PropTypes.oneOf(['sm', 'md', 'lg']),

		onCancel: React.PropTypes.func,
		onDelete: React.PropTypes.func,
		onDiscard: React.PropTypes.func,
		submit_btn_text: React.PropTypes.string
	},
	render: function(){
		var scale = this.props.scale || 'sm';
		var onCancel = this.props.onCancel;
		var onDelete = this.props.onDelete;
		var onDiscard = this.props.onDiscard;
		var submit_btn_text = this.props.submit_btn_text;

		return dd.div(null,
			dd.button({type: 'submit', className: 'btn btn-primary btn-' + scale}, submit_btn_text || 'Save'),
			' ',
			onDiscard ? dd.button({className: 'btn btn-default btn-' + scale, onClick: onDiscard}, 'Undo Changes') : null,
			' ',
			onCancel ? dd.button({className: 'btn btn-default btn-' + scale, onClick: onCancel}, 'Cancel') : null,
			' ',
			onDelete ? dd.button({className: 'btn btn-danger btn-' + scale, onClick: onDelete}, 'Delete') : null
		);
	}
});
