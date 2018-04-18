

//declare some local game variablesv

// let gamestate = 'player join'
let gamedata ={players:{}}
module.exports = function(app,io,socket){



    socket.on('playerJoined', ()=>{
        console.log("a new player joined, and thier ID is ", socket.request.cookies.io)
        
        gamedata.players[socket.request.cookies.io]={rot:{x:3,y:50}}
        console.log("the players in the waiting room are", gamedata.players)
        //christen the socket, there is probably a way better way to do this. 
        socket.emit('namePlayer',socket.request.cookies.io)

        if(Object.keys(gamedata.players).length >=2){
            console.log("starting the game with",Object.keys(gamedata.players).length, " players" )
            io.emit('startgame')
            gameloop(gamedata)
        }
    })

    const gameloop=(gamedata)=>{
        //emit a command to render

        io.emit('redraw',gamedata)

        //receive a response that the client has rendered
    }
    socket.on('updated',(updatedData)=>{
        // console.log("the returned updated data is", updatedData)
    //    wait a second 
    //convert the updated data into new gamedata
    gamedata.players[socket.request.cookies.io].rot.x += 0.1
    gamedata.players[socket.request.cookies.io].rot.y += 0.1
    // console.log("server can see that the state was updated")
    setTimeout(()=>{
        //after 3000 seconds, call the game loop again
        // console.log("are we getting in here??")

        gameloop(gamedata)
        
    },5000)
    })

}


//   const gameLoop=(gamestate)=>{
//     console.log("the gamestate is", gamestate)
//     switch(gamestate){
      
//       case 'player join':
//       //make a waiting room here.
//       console.log("player joined")

//       gamestate = 'waiting room'
  
//       break; 
      
//       case 'waiting room':
//       //add something here with instructions and potentially audio?? so kewl
 
//       break;


//       case 'initilize':
//       //make this an asynch function
//       createScene();
//       gamestate = 'play';

//       break;


//       case 'play':
//       //make this an asynch function
//       requestAnimationFrame(update)
//       //gameLoop(gamestate)
//       break;
      
//       case 'fade out':
//       console.log("game over, bye")
//       break;
//     }
//     gameLoop(gamestate)
//   }
//   gameLoop(gamestate)

// }