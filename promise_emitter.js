
var Q = require('q')

var Emitter = require('events').EventEmitter

Emitter.prototype.await = function await(event){
  var result = Q.defer()
  this.once(event, function(){

    if(arguments.length === 0){
      result.resolve()
    } else if(arguments.length === 1){
      result.resolve(arguments[0])
    } else {
      result.resolve(arguments)
    }
  })
  
  return result.promise
}


module.exports.EventEmitter = Emitter


