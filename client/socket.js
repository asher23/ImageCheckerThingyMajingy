import io from 'socket.io-client'
import {whiteboard}  from './components/drawingBoard'
import {finishedEmitter} from './components/home'
const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})


whiteboard.on('draw', (start, end, id, e, color) => {
  socket.emit('imDrawing', start, end, id, e, color)
})

finishedEmitter.on('finished', () => {
  socket.emit('finished')
})

socket.on('itsover', () => {
  console.log('finishedemitter', finishedEmitter)
  finishedEmitter.urdone(true)
})

socket.on('otherDraw', (start, end, id, e, color) => {
  whiteboard.draw(start, end, false, id, e, color)
})

export default socket
