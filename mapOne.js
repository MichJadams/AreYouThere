const THREE = require('three')
const collisionHashTwoSpiral ={
    000: true,
    100: true, 
    200: true,
    300: true, 
    400: 'winning',

    410: true,
    411: true, 
    412: true, 
    413: true, 
    414: true, 

    424: true,
    324: true,
    224: true,
    124: true,
    024: true,

    034: true,
    033: true,
    032: true,
    031: true,
    030: true,

    040: true,
    140: true, 
    240: true,
    340: true, 
    440: true,

    044: true,
    043: true,
    042: true,
    041: true,
    040: true,
}
//fill in map design objects
const collisionHashZigZag ={

}
function bigBlock(width, height, depth, collisionMap){
    let arrayOut = []
    for(let w=0;w<width;w++){
        for(let h=0;h<height;h++){
            for(let d=0;d<depth;d++){
                const stringkey = w.toString().concat(h,d)
                if(collisionMap[+stringkey]){
                    //if the coordinates are in the predefined instructions, or hash table, then add a block
                    if(collisionMap[+stringkey] === 'winning'){
                        const block = {
                            rotation: new THREE.Euler(0,0,0),
                            location: new THREE.Vector3(w,h,d),
                            color: 0xffffff,
                            transparent:true, 
                            wireframe: true,
                            width: 1, 
                            height:1, 
                            depth:1,
                            opacity: 0.3
                        }
                        arrayOut.push(block)
                    }else{
                        const block = {
                            rotation: new THREE.Euler(0,0,0),
                            location: new THREE.Vector3(w,h,d),
                            color: 0xff0000,
                            transparent:true, 
                            wireframe: true,
                            width: 1, 
                            height:1, 
                            depth:1,
                            opacity: 0.3
                        }
                        arrayOut.push(block)
                    }
                }
            }
        }
    }
    return arrayOut
}
module.exports ={
    one: bigBlock(5,5,5,collisionHashTwoSpiral),
    two: bigBlock(5,5,5,collisionHashTwoSpiral),
    mapTwoCollisionHash: collisionHashTwoSpiral,
    mapThreeCollisionHash: collisionHashZigZag
}