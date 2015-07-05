
require('../promise_emitter')

var net = require('net')
var fs = require('fs')
var q = require('q')
var co = require('co')

var mpsock = require('../index')

var mkTempPath = require('../pair').mkTempPath

var Client = mpsock.Client
var Server = mpsock.Server


co(function *test(){


  var S = new Server()
  var C = new Client()

  var sockpath = mkTempPath()

  S.listen(sockpath)

  console.log('listen')
  yield S.await('listening')
  console.log('listening')
  

  C.connect(sockpath)

  var s = yield S.await('connection')

  console.log('connection')

  S.close()
  
  var c = C

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

