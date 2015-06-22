

require('../promise_emitter')

var net = require('net')
var fs = require('fs')

var co = require('co')


var S = new net.Server()

var sockpath = '/tmp/blablatest.sock'

S.on('close', function(){
  console.log('S.on.close', arguments)

  console.log(S)
  
})

S.on('connection', function(conn){
  console.log('S.on.connection')

  console.log('S.close()')
  S.close()
  console.log('S.close()->')

  console.log('S._handle', S._handle)
  
})

S.on('error', function(err){
  console.log('S.on.error', err)
})

S.listen(sockpath, function(){
  console.log('S.on.listening')

  var C = new net.Socket()
  
  C.connect(sockpath)
  
  C.on('connect', function(){
    console.log('C.on.connect')

    //console.log('C.destroy()')
    //C.destroy()
    
  })

  C.on('error', function(err){
    console.log('C.on.error', err)
  })

  C.on('end', function(){
    console.log('C.on.end')
  })
  // C.destroy()
  
  // S.close()
})






