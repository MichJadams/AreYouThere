import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8081');

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
export { subscribeToTimer,subscribeToWaitingPlayers, subscribeToServers }