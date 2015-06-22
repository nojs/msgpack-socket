

function one(ch){

  ch.on('message', function(m){

    ch.send([0,0,['something']])

  })
  
}


function  *two(ch){


  var m = yield ch.recv()

  assert(typeof m.length === 'number' && m.length === 1)

  var handshake = m[0]

  assert(handshake === options.uuid)

  var sid = 0
  var method = RPC.invoke

  ch.send([sid, method, ['PUT', '/path/bla', 'HTTP/1.0',
                         [['host', 'some.host.dd'],
                          ['content-type', 'application/json']]]])

  ch.send([sid, method, ['bodychunk1\n']])
  ch.send([sid, method, ['bodychunk2\n']])
  ch.send([sid, method, ['bodychunk3\n']])


  var [sid1, method1, args] = yield ch.recv()
  
  assert(sid1 === sid && method1 === RPC.write)
  assert(__eql(args[0], ['HTTP/1.1', 200,
                         [['content-type', 'application/json']]]))

  var [sid1, method1, args, ...rest] = yield ch.recv()
  assert(sid1 === sid && method1 === RPC.write)
  assert(args[0] === 'bodychunk1\n')
  
  var [sid1, method1, args] = yield ch.recv()

  assert(sid1 === sid && method1 === RPC.write)
  assert(args[0] === 'bodychunk2\n')
  
  var m = yield ch.recv()

  var sid1 = m[0], method1 = m[1], args = m[2]
  assert(sid1 === sid && method1 === RPC.write)
  assert(args[0] === 'bodychunk3\n')
  
}

function three(){

  console.log('bla')

  var [a,b,c, ...rest] = [1,2,3,4,5,6,7,8]

  console.log('a,b,c,rest', a,b,c,rest)
  
  assert(false, 'poijpoijasf')

  
}


three()

