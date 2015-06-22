
require('../promise_emitter')

var net = require('net')
var fs = require('fs')
var q = require('q')

var co = require('co')

var mkPair = require('../pair').mkSocketPair

function sleep(ms){
  var result = q.defer()
  
  setTimeout(function(){
    result.resolve()
  }, ms)
  return result.promise
  
}

function *read(sock,n){
  while(true){
    var d = sock.read()
    if(d){
      return d
    }
    yield [sock.await('readable'), sock.await('end')]
    console.log('readable')
  }
}

co(function *test(){

  var cs = yield mkPair()

  cs[1].on('readable', function(){
    console.log('--- readable event')
  })

  console.log('pair')

  for(var i=0;i<10;i++){

    if(i >= 5){
      cs[0].end()
    } else {
      console.log('writing')
      cs[0].write('testing123 '+i)
    }


    console.log('sleeping')
    yield sleep(1000)
    console.log('awake')

    var d = yield read(cs[1])
    
    console.log('data %s', d)
    
  }

  cs[0].end()

}).catch(function(err){
  console.log(err.stack)
})






