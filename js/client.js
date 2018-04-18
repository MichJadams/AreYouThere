console.log("hereexport ")
export let Client = {}
Client.socket = io.connect()

Client.sendTest = (data)=>{
    console.log("test sent to the server")
    Client.socket.emit('test',data)
}

Client.playerJoined=()=>{
    console.log("a player joined")
    console.log(Client.socket)
    Client.socket.emit('playerJoined')
}
//emit a command saying that the state has been rendered
// Client.redraw=()=>{
    // }
Client.updated=(updatedData)=>{
    Client.socket.emit('updated',updatedData)
}