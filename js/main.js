import 'three';
import 'three/OrbitControls';
import {createScene} from './createScene.js'
import {update} from './initScene.js'
import {Client} from './client.js'

// function init() {
// 	// set up the scene
// 	createScene();
//   Client.sendTest("je")
// 	//call game loop
// 	update();
// }



function init() {
  let gamestate = 'initilize'
  
  const gameLoop=(gamestate)=>{
    
    switch(gamestate){
      
      case 'player join':
      
      //make a waiting room here.

      Client.playerJoined()
      gamestate = 'waiting room'
      gameLoop(gamestate); //merp
      
      break; 
      
      case 'waiting room':
      
      Client.socket.on("startgame", ()=>{
        console.log("changing gamestae")
        gamestate = 'initilize';
      })
      //add something here with instructions and potentially audio?? so kewl
    
      gameLoop(gamestate)
      break;
      case 'initilize':
      createScene();
      gamestate = 'play';
      break;
      case 'play':
     

      update();
      break;
      
      case 'fade out':
      console.log("game over, bye")
      break;
    }

  }
  gameLoop(gamestate,update)

}
init();