var dd = require('react-dd');
var React = require('react');

module.exports = dd.createClass({
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
