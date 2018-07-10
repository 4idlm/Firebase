const express = require("express");
const path = require('path');
const Puid = require('puid');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const app = express();
const firebase = require('firebase-admin');
const functions = require('firebase-functions');
 

firebase.initializeApp(functions.config().firebase);
 

 let db = firebase.database().ref('/vinoth/beta/appointmentAPI')
 var pink;
 db.on('value', (snapshot) => {
  
    let original = snapshot.val();
  pink = original.medicinesecretkey; 
    console.log('original',original.medicinesecretkey)

console.log("data",pink)
 

let puid;

// generate puid (long-version 24-chars)

puid = new Puid();
console.log(puid.generate());

const uniqueid = puid.generate()
console.log('uniqueid', uniqueid);


//token generation in apis

var token = jwt.sign({ id: uniqueid, name: "vinoth", cost: 500 }, `${pink}`, { expiresIn: '90s' });
console.log('token is generated', token)


//encrypt the token 
var mykey = crypto.createCipher('aes-128-cbc', 'secretkey');
var theCipher = mykey.update(token, 'utf8', 'hex')
theCipher += mykey.final('hex');

console.log('the sematic', theCipher)

app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist/css/'))
app.use('/style', express.static('style/'))
app.set('view engine', 'pug');

app.get("/ordermedicine", (request, response) => {
  //decrypt the data
  console.log('rr', theCipher)
  console.log('rr', request.query.token)

  let medicinetoken = request.query.token;

  function decrypt(medicinetoken) {

    try {
      var decipher = crypto.createDecipher('aes-128-cbc', 'secretkey');
      var dec = decipher.update(medicinetoken, 'hex', 'utf8')
      dec += decipher.final('utf8');
      return { result: dec };
    }
    catch (err) {
      response.status(404).render('err.pug')
    }
  }


  const dec = decrypt(medicinetoken);
  console.log('decryp the data', dec.result)


  jwt.verify(dec.result,`${pink}`, (err, decode) => {


    if (err) {
      response.status(404).render('expireurl.pug')
    }
    if (decode) {
      console.log(decode.exp)
      response.status(200).render('index.pug', decode)
    }

  })

});
});
const api4 = functions.https.onRequest(app);

module.exports = {
  api4
};