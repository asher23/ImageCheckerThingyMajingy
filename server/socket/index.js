module.exports = (io) => {
  // io.on('connection', (socket) => {
  //   console.log(`A socket connection to the server has been made: ${socket.id}`)

  //   socket.on('disconnect', () => {
  //     console.log(`Connection ${socket.id} has left the building`)
  //   })
  // })


  io.on('connection', function(socket){
    
    
      //receives the newly connected socket
      //called for each browser that connects to our server
      console.log('A new client has connected')
      console.log('socket id: ', socket.id)
      socket.room = 'new room'
      var room 
      console.log(socket.room)
      //event that runs anytime a socket disconnects
      socket.on('disconnect', function(){
        console.log('socket id ' + socket.id + ' has disconnected. : ('); 
      })
      socket.on('finished', () => {
        socket.broadcast.emit('itsover')
      })
    
      // server is receiving draw data from the client here 
      // so we want to broadcast that data to all other connected clients 
      socket.on('imDrawing', function(start, end, id, e, color){
    
        // we need to emit an event all sockets except the socket that originally emitted the 
        // the draw data to the server 
        // broadcasting means sending a message to everyone else except for the 
        // the socket that starts it 
        // console.log('insideimdrawing', e)
        console.log('id in server side', id)
        console.log('COLOR', color)
        socket.broadcast.emit('otherDraw', start, end, id, e, color); 
      }); 
    
    
    })
}
