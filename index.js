const express = require("express");
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');
// appwrite handles cors for us...
app.use(bodyParser.json());
const cardArt = require('./routes/getCardArt.js') // the './' indicates it is in a subfolder 

//--------- special middleware endpoints for seperate uses
app.use('/getCardArt', cardArt);

//--------- statically serving everything in the public folder
app.use(express.static('public'));                               //sets idle out timer for fetching
const server = app.listen(process.env.PORT, function () {
    const port = server.address().port;
    console.log("Server started at " + process.env.WEBSITEDOMAIN);
});
server.timeout = 200000;  
