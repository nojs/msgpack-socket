
var channel = require('./')


function test1(){

  var C = new channel.Client()
  var S = new channel.Server()


  S.listen('localhost', 12349)

  C.connect('localhost', 12349)


  S.on('session', function(s){

    s.on('message', function(m){
      
    })


    s.on('error', function(err){

      console.log(err)
      
    })
    
    
    
  })

  
  
}
