

require('./promise_emitter')

var net = require('net')
var fs = require('fs')
var q = require('q')

var util = require('util')

var co = require('co')

function mkTempPath(){
  var uid = Math.floor(Math.random()*0x100000000).toString(36)
  return util.format('/tmp/%s-%s.sock', process.pid, uid)
}

function *mkSocketPair(){

  var S = new net.Server()

  var sockpath = mkTempPath()

  console.log('sockpath', sockpath)

  S.on('close', function(){
    
    console.log('S.on.close', arguments)

  })

  console.log('S.listen(sockpath)')
  S.listen(sockpath)

  yield S.await('listening')

  console.log('listening')

  var C = new net.Socket()
  
  C.connect(sockpath)
  
  var conn = yield S.await('connection')
  
  console.log('S.on.connection', conn._handle.fd)

  S.close()

  return [C, conn]

}

module.exports.mkSocketPair = mkSocketPair

module.exports.mkTempPath = mkTempPath
