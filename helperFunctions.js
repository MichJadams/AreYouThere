const randomKey = (obj)=> {
    let keys = Object.keys(obj)
    return keys[ keys.length * Math.random() << 0];
};

module.exports ={randomKey}