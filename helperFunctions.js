const randomKey = (obj)=> {
    let keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
};
const quorum = (obj, playerCount)=>{
    count = 0 
    for(key in obj){
        count += obj[key]
    }
    if(count>= playerCount){
        return true
    }else{
        return false 
    }
}

module.exports ={randomKey,quorum}