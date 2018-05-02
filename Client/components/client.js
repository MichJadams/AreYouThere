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
export { subscribeToTimer,subscribeToWaitingPlayers, subscribeToServers,subscribeToServerCookieID }