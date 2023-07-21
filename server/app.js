const express = require('express')
const mongoose = require('mongoose')
const app = express()
const http = require('http');
const cors = require('cors')
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
cors:{
    origin:'*'}

});
const bodyParser = require('body-parser')
const userRouter = require('./router/userRouter')
const playerRouter = require('./router/playerRouter')

app.use(cors())
app.use(bodyParser.json(),bodyParser.urlencoded({ extended: false }))


app.use('/auth',userRouter)
app.use('/player',playerRouter)

mongoose.connect(`mongodb+srv://@cluster1.syv6z7h.mongodb.net/3devn?retryWrites=true&w=majority`).then(()=>{

  server.listen(4000,()=>{
    console.log('server running on 4000 and DB connected')
  })
}).catch(err=>{
  console.log('server not responding ...')
})


const playerData = {};
const chatMessages = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Receive and broadcast player data
  socket.on('playerData', (data) => {
    
    playerData[socket.id] = data;
    io.emit('playerData', playerData); // Broadcast the player data to all clients
  });

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    // const player = playerData[socket.id];
    if (socket.id) {
      const chatMessage = `user ${socket.id}: ${message}`;
      chatMessages.push(chatMessage);

      // Broadcast the chat message to all connected players
      io.emit('chatMessage', chatMessage);
    }
  });

  // Clean up player data on disconnect
  socket.on('disconnect', () => {
    delete playerData[socket.id];
    io.emit('playerData', playerData); // Broadcast the updated player data to all clients
    console.log(`Disconnected: ${socket.id}`);
  });
});
// const players = {};

// io.on('connection', (socket) => {
//   // Generate a unique player ID
//   const playerId = socket.id;

//   // Send the player ID to the connected client
//   socket.emit('playerId', { playerId });

//   // Listen for player data updates from the client
//   socket.on('playerData', (data) => {
//     const { position, rotation } = data;

//     if (position && rotation) {
//       // Update the player data
//       players[playerId] = { position, rotation };

//       // Broadcast the player data to all connected clients
//       io.emit('playerData', players);
//     }
//   });

//   // Clean up the player data when a client disconnects
//   socket.on('disconnect', () => {
//     delete players[playerId];

//     // Broadcast the updated player data to all connected clients
//     io.emit('playerData', players);
//   });
// });
