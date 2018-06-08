const THREE = require('three')
function movement(keycode,playerlocation){

    const mapOne = require('./mapOne')
    const deltMovement = 1 
        if(keycode == 87){
            //forward
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z-deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z-1)
            }
        }
        if(keycode == 65){
            //left
            const collisionCheckPlayerLocation = (playerlocation.x-deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x-deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 83){
            //backwards
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z+deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z+deltMovement)
            }
        }
        if(keycode == 68){
            //right
            const collisionCheckPlayerLocation = (playerlocation.x+deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x+deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 69){
            //up
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y+deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x,playerlocation.y+deltMovement,playerlocation.z)
            }
        }
        if(keycode == 81){
            //down
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y-deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                return new THREE.Vector3(playerlocation.x,playerlocation.y-deltMovement,playerlocation.z)
            }
        }
        return playerlocation
    
}
module.exports ={movement}