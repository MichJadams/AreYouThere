console.log("here in the init scene file")

import scene from './createScene'

const update=()=>{
    //animate
    scene.childern[0].rotation.x += 0.01;
    hero.rotation.y += 0.01;
    render();
	requestAnimationFrame(update);//request next update
}
const render=()=>{
    console.log("rerender??")
    renderer.render(scene, camera);//draw
}
const onWindowResize=()=>{
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}
update()