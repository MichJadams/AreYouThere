

const THREE = require('three')
// import {Client} from './client.js'

 let scene;

 let hero;
 let sceneWidth;
 let sceneHeight;
 let camera;
 let renderer;
 let dom;
 let sun;
 let ground;
 let orbitControl;

function generatePlayer(playerID,scene){
	var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	hero = new THREE.Mesh( heroGeometry, heroMaterial );
	hero.castShadow=true;
	hero.receiveShadow=false;
    hero.position.y=2;
    hero.name = playerID

}
function createScene(){
	
    //add a check here to see number of players.... eventually 
    sceneWidth=600;
	sceneHeight=600;
	
    scene = new THREE.Scene();//the 3d scene
    //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( sceneWidth, sceneHeight );
    dom = document.getElementById('gameScene');
	dom.appendChild(renderer.domElement);
	
	//add items to scene
	// var heroGeometry = new THREE.BoxGeometry( 1, 1, 1 );//cube
	// var heroMaterial = new THREE.MeshStandardMaterial( { color: 0x883333 } );
	// hero = new THREE.Mesh( heroGeometry, heroMaterial );
	// hero.castShadow=true;
	// hero.receiveShadow=false;
    // hero.position.y=2;
    // hero.name = "hero"
    // scene.add(hero) 
    
	var planeGeometry = new THREE.PlaneGeometry( 5, 5, 4, 4 );
	var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
	ground = new THREE.Mesh( planeGeometry, planeMaterial );
	ground.receiveShadow = true;
	ground.castShadow=false;
    ground.rotation.x=-Math.PI/2;
    ground.name = "ground"
    scene.add( ground )


	camera.position.z = 5;
	camera.position.y = 1;
	
	sun = new THREE.DirectionalLight( 0xffffff, 0.8);
	sun.position.set( 0,4,1 );
	sun.castShadow = true;
    scene.add(sun);

	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;

    
	orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	orbitControl.addEventListener( 'change', render.render(scene,camera) );
	//orbitControl.enableDamping = true;
	//orbitControl.dampingFactor = 0.8;
	orbitControl.enableZoom = false;
	
	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone
	// console.log("The world has been generated", scene)
	return scene
	// window.addEventListener('resize', onWindowResize, false);//resize callback
 
}

module.exports={createScene,generatePlayer}