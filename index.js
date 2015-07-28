module.exports.types = {
	"checkbox": require("./inputs/Checkbox"),
	"select": require("./inputs/Select"),
	"text": require("./inputs/Text"),
	"textarea": require("./inputs/Textarea")
};

module.exports.install = function(InputTypes){
	Object.keys(module.exports.types).forEach(function(type){
		InputTypes.setInputType(type, module.exports.types[type]);
	});
};
