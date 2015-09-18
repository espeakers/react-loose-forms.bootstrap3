var HorizontalFields = require("./HorizontalFields");

module.exports = function(form, layout, scale, label_size){
  return HorizontalFields({
    fields: form.Form_buildSchema(),
    errors: form.state.errors || {},
    buildInput: form.Form_buildInput,
    layout: layout,
    scale: scale,
    label_size: label_size
  });
};
