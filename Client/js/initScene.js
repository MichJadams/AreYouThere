// import 'three'


import {Client} from './client.js'
let updatedData={}
export const update=(updateData,playerID)=>{
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

