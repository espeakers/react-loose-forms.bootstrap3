module.exports.types = {
  "checkbox": require("./inputs/Checkbox"),
  "combo": require("./inputs/Combo"),
  "date": require("./inputs/Date"),
  "file": require("./inputs/File"),
  "initial": require("./inputs/Initial"),
  "select": require("./inputs/Select"),
  "static": require("./inputs/Static"),
  "USD": require("./inputs/USD"),
  "text": require("./inputs/Text"),
  "textarea": require("./inputs/Textarea")
};

module.exports.install = function(InputTypes){
  Object.keys(module.exports.types).forEach(function(type){
    InputTypes.setInputType(type, module.exports.types[type]);
  });
};
