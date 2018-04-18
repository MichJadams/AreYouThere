


module.exports = function(app,io,socket){
    let players = {}
    socket.on('playerJoined', ()=>{
        console.log("a new player joined, and thier ID is ", socket.request.cookies.io)
        players[socket.request.cookies.io] = {}

        console.log("the players in the waiting room are", players)
        console.log(Object.keys(players))

        if(Object.keys(players).length >=2){
            console.log("starting the game with",Object.keys(players).length, " players" )
            io.emit('startgame')
        }
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