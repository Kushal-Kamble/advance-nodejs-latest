const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io') // Server object destructure ka use kr rha hai

const app = express()
const server = createServer(app)
const io = new Server(server) // server bna rha hai

app.use(express.static('public')) // ye ek middlewere hai static file

app.get('/', (req, res) => {
  return res.sendFile('index.html')
})

// <!-- es client se massage aayega index.js pe -->

// <!-- o socket es variable pe aayega -->
io.on('connection', (socket) => { // io se check krega request aayi hai to connection bna de
  // socket ko hum client khenge
  console.log('A User Connected : ' + socket.id)

  socket.on('message', (msg) => { // ye callback function hai o aapne aap run ho jayega massage aane ke baad
    console.log(msg)
    io.emit('message', msg) // message ye key hai
  })

   socket.on('disconnect', () => {
    console.log('User Disconnected')
  })
})

server.listen(5000, () => {
  console.log('server running at 5000 Port')
})