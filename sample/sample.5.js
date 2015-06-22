


function one(ch){


  ch.recv(

    [0, RPC.heartbeat, []] => {
      ch.send(0, RPC.heartbeat, [])
    }
    
    [int:Sid, int:Method, list:Args, ..._Rest] => {

      console.log(Sid, Method, Args)

      ch.send(Sid, RPC.reply, Args)

    }

    

  )
}



