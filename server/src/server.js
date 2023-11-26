require('dotenv').config()

const Joi = require("joi"); // npm i joi@13.1.0
const express = require("express"); // npm i express
const cors = require("cors") // npm i cors
const bodyParser = require("body-parser"); // npm i body-parser
const fs = require("fs"); // npm i fs
const path = require("path"); // npm i path

const app = express();
app.use(cors())

const jsonParser = bodyParser.json();
app.use(jsonParser);
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// card loader
const cards = [];
const filename = "PauperCubeInitial_20231126.txt"
const file = path.join("../local/", filename)
function CardLoader() {
    data = fs.readFileSync(file, 'utf8');
    data.split(/\r?\n/).forEach((data) => {
        data_str = data.toString()
        cards.push(data_str)
    });
};

// REST API
const endPoint = "/cube/:id(\\d+)";
// get cards
app.get("/cube", (req, res) => {
console.log('hello')
CardLoader()
console.log('goodbye');
});
// list loaded cards
app.get("/list", (req, res) => {
console.log('hello')
cards.forEach((card) => {
    console.log("card:"+card)
});
console.log('goodbye');
});

// Setup HTTP Server
const defaultPort = 5000;
const portNo = process.env.PORT || defaultPort;
app.listen(portNo, () => {
  console.log(`Listening on port ${portNo}`);
});
