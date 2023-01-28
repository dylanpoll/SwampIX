const express = require("express");
const app = express();
require('dotenv/config');

// appwrite handles cors for us...
app.use(express.static('public'));
const server = app.listen(process.env.PORT, function () {
    const port = server.address().port;
    console.log("Server started at " + process.env.WEBSITEDOMAIN);
});
