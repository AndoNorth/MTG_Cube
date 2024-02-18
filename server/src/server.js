require('dotenv').config()

const Joi = require("joi"); // npm i joi@13.1.0
const express = require("express"); // npm i express
const cors = require("cors") // npm i cors
const bodyParser = require("body-parser"); // npm i body-parser
const socketIO = require('socket.io'); // npm i socket.io

const app = express();
app.use(cors())

const jsonParser = bodyParser.json();
app.use(jsonParser);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// sessions
const sessions = {};

app.post('/createSession', (req, res) => {
  while (true) {
    var sessionId = generateSessionId();
    if(!sessions.hasOwnProperty(sessionId)){
      break;
    }
  }
  sessions[sessionId] = {players: []};
  res.json({sessionId});
});

// Function to generate a unique session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 8);
}

// REST API
const endPoint = "/cube/:id(\\d+)";
// get cards
app.get("/cube", (req, res) => {
CardLoader();
// res.send(JSON.stringify(cards));
res.send(cards);
});

// HTTP Server
const defaultPort = 5000;
const portNo = process.env.PORT || defaultPort;
const server = app.listen(portNo, () => {
  console.log(`Listening on port ${portNo}`);
});

// socket io event manager
const io = socketIO(server, {
  cors: {
    origin: `http://127.0.0.1:5173`, // only for development, this would be changed in production
    methods: ["GET", "POST"]
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a draft session
  socket.on('joinSession', (sessionId, playerName) => {
    if (sessions[sessionId].players.length >= MAX_NO_PLAYERS) {
      socket.emit('sessionError', 'Session is full')
    }
    console.log(`${playerName} joined, session ${sessionId}`)
    if (sessions[sessionId]) {
      // Store the player information in the session
      sessions[sessionId].players.push({ id: socket.id, name: playerName });
      // Join the socket room for the specific session
      socket.join(sessionId);
      // Notify all players in the session about the new player
      io.to(sessionId).emit('playerJoined', sessions[sessionId].players);
    } else {
      // Handle invalid session
      socket.emit('sessionError', 'Invalid session ID');
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});