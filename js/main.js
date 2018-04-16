import 'three';
import 'three/OrbitControls';

let sceneWidth;
let sceneHeight;
let camera;
let scene;
let renderer;
let dom;
let hero;
let sun;
let ground;
let orbitControl;



function init() {
	// set up the scene

	//call game loop
  let gamestate = 'initilize'

  console.log("but I did get here")

 
  const gameLoop=(gamestate)=>{

    console.log("here")
    switch(gamestate){

      case 'initilize':
      createScene();
      gameState = 'fade in';
      break; 
      
      case 'fade in':
      //add something here with instructions and potentially audio?? so kewl
      gameState = 'play'
      break;
      
      case 'play':
      update();
      break;
      
      case 'fade out':
      console.log("game over, bye")
      break;
    }
    // gameLoop(gamestate); //merp
  }
  gameLoop(gamestate)

}
init();