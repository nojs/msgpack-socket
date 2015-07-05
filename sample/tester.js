
var mp = require('msgpack-bin')

require('../promise_emitter')


var locatorGraph = {
  0: ['resolve', {}, {
    0: ['value', {}],
    1: ['error', {}],}],
  1: ['connect', {}, {
    0: ['write', null],
    1: ['error', {}],
    2: ['close', {}]}],
  2: ['refresh', {}, {
    0: ['value', null],
    1: ['error', {}]}],
  3: ['cluster', {}, {
    0: ['write', null],
    1: ['error', {}],
    2: ['close', {}]}]}



var net = require('net')
var fs = require('fs')
var q = require('q')
var co = require('co')

var mpsock = require('../index')

var Client = mpsock.Client
var Server = mpsock.Server
var Socket = mpsock.Socket


co(function *test(){

  var s = new net.Socket()

  s.connect(10053, 'cocs01h.tst12.ape.yandex.net')

  yield s.await('connect')

  console.log('connected')
  
  var C = new Socket(s)

  console.log('connection')

  C.sendmsg([4, 0, ['unicorn']])

  var m = yield C.recvmsg(mp.unpack)

  console.log('response', JSON.stringify(m, null, 4))

  C.end()

  
}).catch(function(err){


  console.log('main: error', err.stack)
  
})



