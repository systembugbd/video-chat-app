const express = require('express')
const app = express()
const {v4: uuidv4 } = require('uuid')

/**
 * You can use http as a require('http').Server(app) request or 
 * You can directly app.listen(PORT)
 */

const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3030

/**
 * Peer Server wand ExpressPeerServer
 */
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
   debug: true
})


/**
 * Set view engine as a ejs
 */
app.set('view engine', 'ejs')
 

/**
 * Set Public Folder as a default static
 */
app.use(express.static('public'))


/**
 * Peer Server for Peer to Peer Connection working with default server together
 */
app.use('/peerjs', peerServer)


/**
 * Set route '/' is home route and redirect to uuidv4 
 */
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

/**
 * Set room.ejs as a home page and send a uuidv4 for user unique id
 */
app.get('/:room', (req, res) => {
   res.render('room', {roomId: req.params.room, port: PORT})
  
})

io.on('connection', socket => {
   socket.on('join-room', (roomId, userId) => {
       socket.join(roomId)
       socket.to(roomId).broadcast.emit('user-connected', userId)

       socket.on('message', message => {
          io.to(roomId).emit('createMessage', message)
       })
   })
})



/**
 * Server listning on the PORT Defined above
 */
server.listen(PORT)
// app.listen(PORT)