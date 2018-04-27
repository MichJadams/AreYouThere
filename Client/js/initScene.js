import 'three'
// import {
// scene,
// hero,
// sceneWidth,
// sceneHeight,
// camera,
// renderer,
// dom,
// sun,
// ground,
// orbitControl,
// } from './createScene'

import {Client} from './client.js'
let updatedData={}
export const update=(updateData,playerID)=>{
    //animate
    // console.log("the secne height in update is", sceneHeight)
    
    // console.log("Here are all the things", scene, renderer,sceneHeight,sceneWidth, camera)
 

    return new Promise((resolve,reject)=>{


        hero.rotation.x = updateData.players[playerID].rot.x;
        hero.rotation.y = updateData.players[playerID].rot.y;

        updatedData={test: "nothing to send back right now"}

        render()
        resolve(updatedData);
        reject(new Error('something broke in initscene promise'))
    })
    
}
export const render=()=>{
    // console.log("rednering", scene, camera)
    renderer.render(scene, camera);//draw
 
}
export const onWindowResize=()=>{
    //resize & align
    // console.log("here")
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}
