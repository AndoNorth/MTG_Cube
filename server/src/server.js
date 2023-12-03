require('dotenv').config()

const Joi = require("joi"); // npm i joi@13.1.0
const express = require("express"); // npm i express
const cors = require("cors") // npm i cors
const bodyParser = require("body-parser"); // npm i body-parser
const fs = require("fs"); // npm i fs
const path = require("path"); // npm i path
const socketIO = require('socket.io'); // npm i socket.io

const app = express();
app.use(cors())

const jsonParser = bodyParser.json();
app.use(jsonParser);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

const MAX_NO_PLAYERS = 8;

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

// drafting 
// card loader
const cardNames = [];
const filename = "PauperCubeInitial_20231126.txt"
const file = path.join("../local/", filename)
function CardLoader() {
  data = fs.readFileSync(file, 'utf8');
  data.split(/\r?\n/).forEach((data) => {
    data_str = data.toString()
    cardNames.push(data_str)
  });
};

// https://scryfall.com/docs/api/cards/search
const scryfallAPI = "https://api.scryfall.com/cards/named?fuzzy="
const MAX_REQ_PER_SEC = 10;
// {"object":"card","id":"5642cdda-789f-4125-a9ff-7c445bb51950","oracle_id":"a30907c0-fbde-4fd3-a8c7-f304305fcea7","multiverse_ids":[571342],"mtgo_id":101502,"tcgplayer_id":276249,"cardmarket_id":664021,"name":"Doomed Traveler","lang":"en","released_at":"2022-07-08","uri":"https://api.scryfall.com/cards/5642cdda-789f-4125-a9ff-7c445bb51950","scryfall_uri":"https://scryfall.com/card/2x2/9/doomed-traveler?utm_source=api","layout":"normal","highres_image":true,"image_status":"highres_scan","image_uris":{"small":"https://cards.scryfall.io/small/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.jpg?1673146959","normal":"https://cards.scryfall.io/normal/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.jpg?1673146959","large":"https://cards.scryfall.io/large/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.jpg?1673146959","png":"https://cards.scryfall.io/png/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.png?1673146959","art_crop":"https://cards.scryfall.io/art_crop/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.jpg?1673146959","border_crop":"https://cards.scryfall.io/border_crop/front/5/6/5642cdda-789f-4125-a9ff-7c445bb51950.jpg?1673146959"},"mana_cost":"{W}","cmc":1.0,"type_line":"Creature — Human Soldier","oracle_text":"When Doomed Traveler dies, create a 1/1 white Spirit creature token with flying.","power":"1","toughness":"1","colors":["W"],"color_identity":["W"],"keywords":[],"all_parts":[{"object":"related_card","id":"5642cdda-789f-4125-a9ff-7c445bb51950","component":"combo_piece","name":"Doomed Traveler","type_line":"Creature — Human Soldier","uri":"https://api.scryfall.com/cards/5642cdda-789f-4125-a9ff-7c445bb51950"},{"object":"related_card","id":"7ebb3b03-943e-4b5a-be04-f59316b81333","component":"token","name":"Spirit","type_line":"Token Creature — Spirit","uri":"https://api.scryfall.com/cards/7ebb3b03-943e-4b5a-be04-f59316b81333"}],"legalities":{"standard":"not_legal","future":"not_legal","historic":"legal","gladiator":"legal","pioneer":"not_legal","explorer":"not_legal","modern":"legal","legacy":"legal","pauper":"legal","vintage":"legal","penny":"legal","commander":"legal","oathbreaker":"legal","brawl":"not_legal","historicbrawl":"legal","alchemy":"not_legal","paupercommander":"legal","duel":"legal","oldschool":"not_legal","premodern":"not_legal","predh":"not_legal"},"games":["paper","mtgo"],"reserved":false,"foil":true,"nonfoil":true,"finishes":["nonfoil","foil"],"oversized":false,"promo":false,"reprint":true,"variation":false,"set_id":"5a645837-b050-449f-ac90-1e7ccbf45031","set":"2x2","set_name":"Double Masters 2022","set_type":"masters","set_uri":"https://api.scryfall.com/sets/5a645837-b050-449f-ac90-1e7ccbf45031","set_search_uri":"https://api.scryfall.com/cards/search?order=set&q=e%3A2x2&unique=prints","scryfall_set_uri":"https://scryfall.com/sets/2x2?utm_source=api","rulings_uri":"https://api.scryfall.com/cards/5642cdda-789f-4125-a9ff-7c445bb51950/rulings","prints_search_uri":"https://api.scryfall.com/cards/search?order=released&q=oracleid%3Aa30907c0-fbde-4fd3-a8c7-f304305fcea7&unique=prints","collector_number":"9","digital":false,"rarity":"common","flavor_text":"He vowed he would never rest until he reached his destination. He doesn't know how right he was.","card_back_id":"0aeebaf5-8c7d-4636-9e82-8c27447861f7","artist":"Lars Grant-West","artist_ids":["21ed6499-c4d3-4965-ab02-6c7228275bec"],"illustration_id":"29d8819e-ae8a-451c-b59e-b062993d9535","border_color":"black","frame":"2015","full_art":false,"textless":false,"booster":true,"story_spotlight":false,"edhrec_rank":3372,"penny_rank":998,"preview":{"source":"Wizards of the Coast","source_uri":"https://magic.wizards.com/en/articles/archive/card-image-gallery/double-masters-2022","previewed_at":"2022-06-16"},"prices":{"usd":"0.02","usd_foil":"0.08","usd_etched":null,"eur":"0.02","eur_foil":"0.03","tix":"0.04"},"related_uris":{"gatherer":"https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=571342&printed=false","tcgplayer_infinite_articles":"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26partner%3Dscryfall%26q%3DDoomed%2BTraveler","tcgplayer_infinite_decks":"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26partner%3Dscryfall%26q%3DDoomed%2BTraveler","edhrec":"https://edhrec.com/route/?cc=Doomed+Traveler"},"purchase_uris":{"tcgplayer":"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F276249%3Fpage%3D1","cardmarket":"https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Doomed+Traveler&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall","cardhoarder":"https://www.cardhoarder.com/cards/101502?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall"}}
function Scryfall(){
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