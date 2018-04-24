const io = require('socket.io').listen(8081);

io.sockets.on('connection', function (socket) {
  socket.on('connection name',function(user){
      console.log("connection")
    io.sockets.emit('new user', user.name + " has joined.");
  })
});
