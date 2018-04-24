
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

Client.updated=(updatedData)=>{
    Client.socket.emit('updated',updatedData)
}

Client.sendCreatedScene=(scene)=>{
    Client.socket.emit('sendCreatedScee',scene)
}