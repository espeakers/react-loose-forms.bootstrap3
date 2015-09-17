module.exports = function(fn){
  return function(e){
    if(e && e.preventDefault){
      e.preventDefault();
    }
    if(e && e.stopPropagation){
      e.stopPropagation();
    }
    fn.call(this, e);
  };
};
