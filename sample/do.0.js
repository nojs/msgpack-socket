
require('../promise_emitter')

var net = require('net')
var fs = require('fs')
var q = require('q')
var co = require('co')

var Socket = require('../index').Socket

var mkSocketPair = require('./pair').mkSocketPair



co(function *test(){

  var cs = yield mkSocketPair()

  var c = new Socket(cs[0])
  var s = new Socket(cs[1])


  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)
  c.send(1,2,3)

  console.log('waiting for readable')
  yield s.await('readable')
  console.log('readable')

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  var m = s.recv()
  console.log('server got message', m)

  c.end()
  


  
}).catch(function(err){


  console.log('main: error', err.stack)
  
})

