import 'three'
import {
scene,
hero,
sceneWidth,
sceneHeight,
camera,
renderer,
dom,
sun,
ground,
orbitControl,
} from './createScene'
import {Client} from './client.js'

export const update=()=>{
    //animate
    // console.log("the secne height in update is", sceneHeight)
    console.log("hrjfdsafae")
    // console.log("Here are all the things", scene, renderer,sceneHeight,sceneWidth, camera)
    hero.rotation.x += 0.01;
    hero.rotation.y += 0.01;
    render();
    requestAnimationFrame(update);//request next update
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
