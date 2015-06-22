

var assert = require('assert')

function genBuf(n){
  var b = new Buffer(n)

  for(var i=0;i<n;i++){
    b[i] = Math.floor(Math.random()*256)
  }

  return b
}


function one(b0, b1){

  assert(b0.length % b1.length === 0, 'b0.length should be multiple of b1.length')

  var N = b0.length / b1.length
  var n = b1.length

  for(var i=0;i<N;i++){
    b1.copy(b0,i*n)
  }

}


function test(){

  var n = 1024*8

  var b0 = new Buffer(n*8*4)
  
  var b1 = genBuf(n)

  var N = 80*1024*2

  var t0 = Date.now()

  for(var i=0;i<N;i++){
    one(b0, b1)
  }

  var t1 = Date.now()

  var dt = (t1-t0)/1000
  var M = b0.length*N/1024/1024

  console.log('copied %s Mbytes in %ss, %sMb/s', M, dt, M/dt)

  var t0 = b0.slice(b1.length*4,b1.length*4+b1.length)

  assert.deepEqual(t0, b1)

}


test()

