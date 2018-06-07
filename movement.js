const THREE = require('three')
function movement(keycode,playerlocation){
    //check for collision?? somehow....
    // console.log("player location", playerlocation),it needs to look ahead, collision detection after the augmentation fo movement. 
    const mapOne = require('./mapOne')
    const deltMovement = 1 
        if(keycode == 87){
            //forward
            // console.log("old player location in terms of z", playerlocation.z)
            // console.log("forward, returning:",new THREE.Vector3(0,0,playerlocation.z+5))

            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z-deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z-1)
            }
        }
        if(keycode == 65){
            //left
            // console.log("left")
            const collisionCheckPlayerLocation = (playerlocation.x-deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x-deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 83){
            //backwards
            // console.log("backwards")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y,playerlocation.z+deltMovement)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y,playerlocation.z+deltMovement)
            }
        }
        if(keycode == 68){
            //right
            // console.log("right")
            const collisionCheckPlayerLocation = (playerlocation.x+deltMovement).toString().concat(playerlocation.y,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x+deltMovement,playerlocation.y,playerlocation.z)
            }
        }
        if(keycode == 69){
            //up
            // console.log("right")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y+deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y+deltMovement,playerlocation.z)
            }
        }
        if(keycode == 81){
            //down
            // console.log("right")
            const collisionCheckPlayerLocation = playerlocation.x.toString().concat(playerlocation.y-deltMovement,playerlocation.z)
            if(mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation] === true){
                // console.log("moving allowed: this",collisionCheckPlayerLocation,"is equal to:", mapOne.mapTwoCollisionHash[+collisionCheckPlayerLocation])
                return new THREE.Vector3(playerlocation.x,playerlocation.y-deltMovement,playerlocation.z)
            }
        }
        console.log("movmenet not allowed")
        return playerlocation
    
}
module.exports ={movement}