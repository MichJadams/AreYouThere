const THREE = require('three')
module.exports ={
    mazeOne:[{
        name: 'bottom wrieframe',
        rotation: new THREE.Euler(0,0,0),
        location: new THREE.Vector3(0,-5,0),
        color: 0xff0000,
        transparent:false, 
        wireframe: true,
        width: 30, 
        height:2, 
        depth:30,
        opacity: 0
    },{
        name: 'bottom transparent',
        rotation: new THREE.Euler(0,0,0),
        location: new THREE.Vector3(0,-5,0),
        color: 0xff0000,
        transparent:false, 
        wireframe: true,
        width: 30, 
        height:2, 
        depth:30,
        opacity: 0.4
    },{
        name: 'left',
        rotation: new THREE.Euler(0,0,0),
        location: new THREE.Vector3(-4.8,0,0),
        color: 0xff0000,
        transparent:false, 
        wireframe: true,
        width: 2, 
        height:5, 
        depth:5,
        opacity: 0
    },{
        name: 'right',
        rotation: new THREE.Euler(0,0,0),
        location: new THREE.Vector3(4.8,0,0),
        color: 0xff0000,
        transparent:false, 
        wireframe: true,
        width: 2, 
        height:5, 
        depth:5,
        opacity: 0
    }],
    mapTwo: bigBlock(5,5,5)
}

function bigBlock(width, height, depth){
    let arrayOut = []
    for(let w=0;w<width;w++){
        for(let h=0;h<height;h++){
            for(let d=0;d<depth;d++){
                const block = {
                        name: 'right',
                        rotation: new THREE.Euler(0,0,0),
                        location: new THREE.Vector3(w,h,d),
                        color: 0xff0000,
                        transparent:false, 
                        wireframe: true,
                        width: 2, 
                        height:5, 
                        depth:5,
                        opacity: 0
                    }
                    arrayOut.push(block)
            }
        }
    }
    return arrayOut
}
console.log("big block", bigBlock(5,5,5))