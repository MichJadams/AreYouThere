import 'three';
import 'three/OrbitControls';
import {createScene, generatePlayer} from './createScene.js'
import {update} from './initScene.js'
import {Client} from './client.js'
let scene

Client.playerJoined()

Client.socket.on('generateScene',()=>{
  scene = createScene();
  console.log("the scene picked from the create scene file", scene)
})
Client.socket.on('startgame',()=>{
  console.log("starting the game!!!!!")
})
Client.socket.on('namePlayer',(playerID)=>{
  Client.socket.name = playerID
  console.log("the scene being passed to generate player", scene)
  generatePlayer(Client.socket.name,scene)
  console.log("this is the players id", Client.socket.name)
})
//recieve a command from the server to redraw the scene
Client.socket.on('redraw',(gamedata)=>{
  //here is where we want to turn the gamedata into the rendering update data
  let updatData = gamedata;

  update(updatData,Client.socket.name)
  .then((updatedData)=>{
    //console.log("this si the updated data from the update function", updatedData)
    Client.updated(updatedData)
  })
  .catch((error)=>{
    console.log(error.message)
  })

})



// function init() {
// 	// set up the scene
// 	createScene();
//   Client.sendTest("je")
// 	//call game loop
// 	update();
// }



// let gamestate = 'player join'
// Client.socket.on("startgame", ()=>{ 
//   console.log("receive a signal to start the game")
//   gamestate = 'initilize';
     
// })
// function init() {
//   const gameLoop=(gamestate)=>{
//     console.log("the gamestate is", gamestate)
//     switch(gamestate){
      
//       case 'player join':
//       //make a waiting room here.
//       console.log("player joined")
//       Client.playerJoined()
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
// init();