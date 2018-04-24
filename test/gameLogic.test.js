const should = require("should");  
const assert = require('chai').assert
const io = require('socket.io-client')
const secrets = require('../secrets.js')

const socketURL =process.env.IP_ADDRESS_FULLSTACK+':8081';
console.log("the socket url", socketURL)
const options ={
    transports:['websocket'],
    'force new connection:': true
};
const chatUser1 = {'name':'testone'}
const chatUser2 = {'name':'testtwo'}

describe("server", function(){  
    it('Should broadcast new user to all users', function(done){
        var client1 = io.connect(socketURL, options);
      
        client1.on('connect', function(data){
          client1.emit('connection name', chatUser1);
      
          /* Since first client is connected, we connect
          the second client. */
          var client2 = io.connect(socketURL, options);
      
          client2.on('connect', function(data){
            client2.emit('connection name', chatUser2);
          });
      
          client2.on('new user', function(usersName){
            usersName.should.equal(chatUser2.name + " has joined.");
            client2.disconnect();
          });
      
        });
      
        var numUsers = 0;
        client1.on('new user', function(usersName){
          numUsers += 1;
      
          if(numUsers === 2){
            usersName.should.equal(chatUser2.name + " has joined.");
            client1.disconnect();
            done();
          }
        });
      });
      
      
});
