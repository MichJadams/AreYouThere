import openSocket from 'socket.io-client';
const socket = openSocket('172.16.23.0:8081');
// const socket = openSocket('http://localhost:8081');

//landing sockets
function subscribeToName(name){
    socket.emit("subscribeToName",name)
}
//lobby sockets 
function subscribeToTimer(cb){
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}
function subscribeToWaitingPlayers(cb){
    socket.on('waitingPlayerList', waitingPlayerList => cb(null, waitingPlayerList));
    socket.emit("subscribeToWaitingPlayers")
}
function subscribeToServers(cb){
    socket.on('serversList', serversList => cb(null, serversList));
    socket.emit("subscribeToServers")
}
function subscribeToJoinServer(serverId){
    socket.emit("subscribeToJoinServer", serverId)
}
//createServer sockets 
function subscribeToServerCookieID(cb){
    socket.on('serverCookieID', cookieID=> cb(null,cookieID));
    socket.emit("subscribeToServerCookieID")
}
//waiting room sockets 
function subscribeToServerState(clientData,cb){
    // console.log("fromt the socket function", clientData)
    socket.on('serverState', serverState=> cb(null,serverState));
    if(clientData.serverId.id){
        const objout = {serverId:clientData.serverId.id,playing:clientData.playing}
        // console.log("obejc out", objout)
        socket.emit("subscribeToServerState",objout)
    }else{

        socket.emit("subscribeToServerState",clientData)
    }
    //now I only want to emit to players in that room/view....eeek, figured this outttt.
}
//maze game state update functions 
function subscribeToGameState(clientData,cb){
    // console.log("are we getting here?, sending", clientData)
    socket.on('gameState', gameState=> cb(null,gameState));
    socket.emit("subscribeToGameState",clientData)
}
function subscribeToCameraPosition(camera, cb){
    // console.log("this is the camera object", camera)
    socket.on('cameraPosition', cameraPosition=> cb(null,cameraPosition));
    socket.emit("subscribeToCameraPosition", camera)
}


export { 
    subscribeToName,
    subscribeToTimer,
    subscribeToWaitingPlayers, 
    subscribeToServers,
    subscribeToServerCookieID, 
    subscribeToServerState,
    subscribeToGameState,
    subscribeToJoinServer,
    subscribeToCameraPosition, 
}