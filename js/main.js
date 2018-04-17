import 'three';
import 'three/OrbitControls';
import {createScene} from './createScene.js'
import {update} from './initScene.js'
import {Client} from './client.js'

function init() {
	// set up the scene
	createScene();
  Client.sendTest("je")
	//call game loop
	update();
}



// function init() {
//   let gamestate = 'initilize'
  
//   const gameLoop=(gamestate,update)=>{
    
//     switch(gamestate){
      
//       case 'initilize':
//       createScene();
//       gamestate = 'fade in';
//       gameLoop(gamestate,update); //merp

//       break; 
      
//       case 'fade in':
      
//       //add something here with instructions and potentially audio?? so kewl
//       gamestate = 'play'
//       gameLoop(gamestate,update)
//       break;
      
//       case 'play':
//       console.log("inside the play case ", typeof update)
//       update();
//       break;
      
//       case 'fade out':
//       console.log("game over, bye")
//       break;
//     }
//     // gameLoop(gamestate,update); //merp
//   }
//   gameLoop(gamestate,update)

// }
init();