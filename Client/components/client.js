import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8081');

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

//createServer sockets 
function subscribeToServerCookieID(cb){
    socket.on('serverCookieID', cookieID=> cb(null,cookieID));
    socket.emit("subscribeToServerCookieID")
}
//waiting room sockets 
function subscribeToServerState(serverID,cb){
    // console.log("fromt he socket function", cb)
    socket.on('serverState', serverState=> cb(null,serverState));
    //now I only want to emit to players in that room/view....eeek.
    socket.emit("subscribeToServerState",serverID)
}
export { subscribeToTimer,subscribeToWaitingPlayers, subscribeToServers,subscribeToServerCookieID,subscribeToServerWaitingRoomCapacity, subscribeToServerState }