require('dotenv/config');
// this file is what the express instance uses to auth to the appwrite service.
const sdk = require('node-appwrite');
const config = {
  project: process.env.PROJECTID,
  endpoint: process.env.ENDPOINT,
  key: process.env.KEY,
  // jwt: process.env.JWT // not in current .env
};
const client = new sdk.Client();
const database = new sdk.Database(client);
client
    .setSelfSigned(true)
    .setProject(config.project)
    .setKey(config.key)
    // .setJWT(config.jwt) // set this to authenticate using JWT
    .setEndpoint(config.endpoint)
;
const collectionName = process.env.COLLECTIONNAME;
const read = [process.env.READ];
const write = [process.env.WRITE];
const promise = database.createCollection(collectionName, read, write);
promise.then(function(response) {
  console.log('success');
  database.createBooleanAttribute(response.$id, 'completed', true, false, false);
  database.createStringAttribute(response.$id, 'text', 255, true, '', false);
}, function(error) {
  console.log('error', error.type, error.message);
});

