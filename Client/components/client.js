// export let Client = {}
// // import 
// Client.socket = io.connect()

// Client.sendTest = (data)=>{
//     console.log("test sent to the server")
//     Client.socket.emit('test',data)
// }

// Client.playerJoined=()=>{
//     console.log("a player joined")
//     console.log(Client.socket)
//     Client.socket.emit('playerJoined')
// }

// Client.updated=(updatedData)=>{
//     Client.socket.emit('updated',updatedData)
// }

// Client.sendCreatedScene=(scene)=>{
//     Client.socket.emit('sendCreatedScee',scene)
// }
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8081');

function subscribeToTimer(cb){
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}
function subscribeToWaitingPlayers(cb){
    socket.on('waitingPlayerList', waitingPlayerList => cb(null, waitingPlayerList));
    socket.emit("subscribeToWaitingPlayers",{name:"john"})
    // socket.emit('subscribeToTimer', 1000);
}
function subscribeToServers(cb){
    socket.on('serversList', serversList => cb(null, serversList));
    socket.emit("subscribeToServers")
}
export { subscribeToTimer,subscribeToWaitingPlayers, subscribeToServers }