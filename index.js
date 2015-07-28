var InputTypes = require('react-loose-forms/InputTypes');

module.exports.types = {
	"text": require("./inputs/Text")
};

module.exports.install = function(){
	Object.keys(module.exports.types).forEach(function(type){
		InputTypes.setInputType(type, module.exports.types[type]);
	});
};
