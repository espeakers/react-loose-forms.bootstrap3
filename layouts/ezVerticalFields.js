var VerticalFields = require("./VerticalFields");

module.exports = function(form, layout, scale){
  return VerticalFields({
    fields: form.Form_buildSchema(),
    errors: form.state.errors || {},
    buildInput: form.Form_buildInput,
    layout: layout,
    scale: scale
  });
};
