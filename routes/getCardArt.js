const express = require('express');  // retrieves the package
const router = express.Router();
const fetch = require('node-fetch');
const bearerToken = process.env.OPENAI_API_KEY;
const fs = require('fs');
const axios = require('axios');

const descriptors = ["the ugly", "the fair", "the terrible", "the unreasonable", "the fake", "the twit", "the big dumb", "the honorable", "the formidable", "the little"];
const nameEndpoints =["https://monsternames-api.com/api/v1.0/goatmen",
    "https://monsternames-api.com/api/v1.0/goblin",
    "https://monsternames-api.com/api/v1.0/ogre",
    "https://monsternames-api.com/api/v1.0/orc",
    "https://monsternames-api.com/api/v1.0/skeleton",
    "https://monsternames-api.com/api/v1.0/troll"]

router.get('/name', async (req, res) => {

    //Generate random name using name generator api
    //Take first and last name and combine with a descriptor that is randomly chosen
    //Possible descriptors: [the ugly, the fair, the terrible, the unreasonable, the fake, the twit, the big dumb, the honorable, the formidable]
    //Make an api call to generate card image    
    
    let randEndpoint = nameEndpoints[Math.floor(Math.random() * nameEndpoints.length)];
    let randDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)];

    fetch(randEndpoint, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(response => { 
      let name = response.fullName + " " + randDescriptor
      return name;
    })
    .then(result => res.json(result)) 
    .catch(error => console.log('error', error));
}),

router.post('/createArt', async (req, res) => {
  try {

    console.log(req.body);
    let stringToGenerateImageWith = req.body.name;
    var raw = JSON.stringify({
      // "prompt": "A rogue-like card game logo", //TODO: get this info from user
      "prompt": stringToGenerateImageWith, //TODO: get this info from user
      "n": 1,
      "size": "256x256"
    });
    //console.log(req.body);//uncomment to echo recieved JSON body in terminal
    // let subroute = "/cardart";
    fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer ' + bearerToken 
      },
      body: raw,
      // body: JSON.stringify(req.body), // this could be used to instead use whatever body we send this endpoint directly.
      redirect: 'follow'
    })
    .then(response => response.json()) // we could pull text etc but json is best.
    .then(response => { 
      return response.data[0].url; //get the url out of the json response body
    })
    .then(result => {
      return new Promise(async (resolve, reject) => {
        let url = result;
        let image_path = './public/resources/cardArt/'+stringToGenerateImageWith.replaceAll(' ','_')+'.png';
        await saveImage(url,image_path.replaceAll('"',''));
        res.json(stringToGenerateImageWith+'.png');
      })
    }) // this res.json() is what is sent back to the requesting client. anything used by res. would do that.
    .catch(error => console.log('error', error));

  } catch (err) {
    res.json({ message: "an error occured while getting card art." });
    console.log({ message: err });
  }
});
//---------------------------------------
//END of routeer activity
//---------------------------------------
module.exports = router;

async function saveImage(url,image_path){
        axios({
          url,
          responseType: 'stream',
        }).then(
          response =>
            new Promise((resolve, reject) => {
              response.data
                .pipe(fs.createWriteStream(image_path))
                .on('finish', () => resolve())
                .on('error', e => reject(e));
            }),
        );
}



//---------------------------------------
//EXAMPLES BELOW
//---------------------------------------

//imports
// const Post = require('../models/EXAMPLE');  //the "model" for our "Post" object
// //routes
//-------JSON BODY ROUTING
// //GETs all the collection data from the linked Database
// router.get('/', async (req, res) => {       // the '/posts' bit adds to the "route" for the server so this would be on http://localhost:5000/posts/ 
//     try {                                   // because this is posts and this "middleware" or rest subprocess is marked with "/"
//         const posts = await Post.find();    //this calls the model post(it is a schema) there are additional sub methods of find
//         res.json(posts);                    //res is short for response, this is responding to the client that sent the request with the data we pulled in the form of a JSON object
//     } catch (err) {
//         res.json({ message: err });
//         console.log({ message: err });
//     }
// });

// router.post('/', async (req, res) => {
//     console.log(req.body);                  //this logs the post being sent into the console, req.body = Required body, in this case it is a raw JSON body being sent as a byte stream.
//     const post = new Post({
//         title: req.body.title,              //JSON lets you do things like pull values from specific titled fields
//         description: req.body.description   //so you can have a named field value passed between different languages
//     });
//     try {
//         const savedPost = await post.save()
//         res.json(savedPost);
//     } catch (err) { res.json({ message: err }); }
// });//end Body routing



