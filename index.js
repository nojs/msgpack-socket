

var net = require('net')
var EventEmitter = require('events').EventEmitter
var assert = require('assert')

var mp = require('msgpack-buf')


function bindHandlers(handlers_prop, emitter, self){

  var handlers = self.hdl[handlers_prop]

  if(!self._hdl){
    self._hdl = {}
  }
  if(!self._hdl[handlers_prop]){
    self._hdl[handlers_prop] = {}
  }

  for(var k in handlers){
    var f = handlers[k].bind(self)
    
    self._hdl[handlers_prop][k] = f
    emitter.on(k, f)
  }
  
}

var slice = Array.prototype.slice


function Socket(conn){

  this._socket = conn
  this._rxBuffer = null
  this._txBox = []
  this._defaultDecoder = mp.unpack
  this.drained = true

  bindHandlers('socket', this._socket, this)
}


Socket.prototype = {

  __proto__: EventEmitter.prototype,
  
  sendmsg: function(msg){
    this._txBox.push(msg)
    this._flush()
  },

  send: function(){
    var args = slice.call(arguments)

    assert(!this.closed, 'send on write-closed socket')
    
    this._txBox.push(args)
    this._flush()
  },

  recvmsg: function *recvmsg(decoder){
    while(true){
      var m = this.recv(decoder)

      if(m !== undefined) return m

      yield this.await('readable')
      console.log('---- readable')
    }
  },

  recv: function(decoder){
    decoder = decoder || this._defaultDecoder

    if(!this._rxBuffer) return undefined
    
    var m = decoder(this._rxBuffer)

    if(m === undefined) return undefined

    var bytesUnpacked = this._rxBuffer.length - decoder.bytes_remaining
    console.log('this._rxBuffer.length, bytesUnpacked, decoder.bytes_remaining')
    console.log(this._rxBuffer.length, bytesUnpacked, decoder.bytes_remaining)

    if(bytesUnpacked === this._rxBuffer.length){
      this._rxBuffer = null
    } else {
      this._rxBuffer = this._rxBuffer.slice(bytesUnpacked)
    }
    return m
  },

  end: function(){
    this.closed = true
    this._socket.end()
  },

  _destroy: function(){
    this._socket.destroy()
  },

  _flush: function(){

    while(this.drained && this._txBox.length){

      var m = this._txBox[0]

      var b = mp.pack(m)

      var r = this._socket.write(b)
      
      console.log('_flush, after .write', this._socket.bufferSize)
      
      if(!r){
        this.drained = false
      }
      this._txBox.shift()
      
    }
  },

  hdl: {

    socket:{

      drain: function(){
        console.log('drain', this._socket.bufferSize)
        
        this.drained = true
        this._flush()
      },
      
      readable: function() {

        console.log('._socket %d readable', this._socket)

        var buf = this._socket.read()

        if(buf === null){
          console.log('got null data from read()')
          
        } else if (buf !== null){
          if(this._rxBuffer){
            console.log('concatenating', this._rxBuffer.length, buf.length, this._rxBuffer.slice(0,10), buf.slice(0,10))
            this._rxBuffer = Buffer.concat([this._rxBuffer, buf])
          } else {
            this._rxBuffer = buf
          }
          this.emit('readable')
        }
      },

      end: function() {
        console.log('socket %d end', this._socket)
        this._socket = null
      },

      error: function(err) {
        console.log('socket error', err)
        this._socket = null
        throw err
      },

    }
  }
}


function Server(){

  this._server = new net.Server()

  bindHandlers('server', this._server, this)
  
}


Server.prototype = {
  __proto__: EventEmitter.prototype,

  listen: function(){
    this._server.listen.apply(this._server, arguments)
  },

  close: function(){
    this._server.close()
    //unbindHandlers(this.hdl.server, this._server)
  },

  hdl: {
    server: {
      connection: function(conn){
        var sock = new Socket(conn)
        this.emit('connection', sock)
      },
      error: function(err){
        console.log('server error', err)
      },
      listening: function(){
        this.emit('listening')
      }
    }
  }
  
}

function Client(){
  var sock = new net.Socket()
  Socket.call(this, sock)
}

Client.prototype = {

  __proto__: Socket.prototype,

  connect: function(){
    return this._socket.connect.apply(this._socket, arguments)
  },

  hdl:{
    socket:{
      __proto__: Socket.prototype.hdl.socket,
      
      connect: function(){
        console.log('socket connected')
        this.emit('connect')
      }

    }
    
  }

}


module.exports.Socket = Socket
module.exports.Server = Server
module.exports.Client = Client


