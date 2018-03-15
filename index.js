'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const uid = require('rand-token').uid;
const qs = require('query-string');
const requestModule = require('request');
// Päringute silumisvahend
// require('request-debug')(requestModule);
const jwkToPem = require('jwk-to-pem');
var jwt = require('jsonwebtoken');

// TARA-teenuse avalik võti PEM-vormingus
var avalikVotiPEM;
// Päri TARA-teenuse avalik võti. Eeldame, et päring
// jõutakse teha enne, kui kasutaja nupule vajutab
var options = {
  url: 'https://tara-test.ria.ee/oidc/jwks',
  method: 'GET'
};
requestModule(
  options,
  function (error, response, body) {
    if (error) {
      console.log('Viga avaliku võtme pärimisel: ', error);
      res.send('Viga avaliku võtme pärimisel: ' + JSON.stringify(error));
      return;
    }
    if (response) {
      console.log('Avaliku võtme pärimine - statusCode: ', response.statusCode);
    }
    var saadudVotmed = JSON.parse(body);
    var avalikVoti = saadudVotmed.keys[0];
    console.log('Saadud avalik võti: ', avalikVoti);
    avalikVotiPEM = jwkToPem(avalikVoti);
  });

// Veebiserveri ettevalmistamine
const app = express();
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

// Sea juurkaust, millest serveeritakse sirvikusse ressursse
// http://expressjs.com/en/starter/static-files.html 
// https://expressjs.com/en/4x/api.html#express.static
app.use(express.static(__dirname + '/public'));

// Sea rakenduse vaadete kaust
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

// application/json parsimiseks
app.use(bodyParser.json());

// application/x-www-form-urlencoded parsimiseks
app.use(bodyParser.urlencoded({ extended: true }));

// Võta keskkonnamuutujasse salvestatud salasõna
var CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log('CLIENT_SECRET: ' + CLIENT_SECRET);

const CLIENT_ID = 'ParmaksonResearch';
const B64_VALUE = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64');

// Päri TARA-teenuse avalik võti
app.get('/voti', function (req, res) {
  var options = {
    url: 'https://tara-test.ria.ee/oidc/jwks',
    method: 'GET'
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log('Viga avaliku võtme pärimisel: ', error);
        res.send('Viga avaliku võtme pärimisel: ' + JSON.stringify(error));
        return;
      }
      if (response) {
        console.log('Avaliku võtme pärimine - statusCode: ', response.statusCode);
      }
      var saadudVotmed = JSON.parse(body);
      var avalikVoti = saadudVotmed.keys[0];
      console.log('Saadud avalik võti: ', avalikVoti);
      res.send('Saadud avalik võti: ' + JSON.stringify(avalikVoti));
    });
});

// Esilehe kuvamine
app.get('/', function (req, res) {
  res.render('pages/index');
});

// Autentimispäringu saatmine
app.get('/auth', (req, res) => {

  // Taasesitusründe vastase kaitsetokeni genereerimine
  // 16-tärgine sõne(tähed - numbrid)
  var token = uid(16);

  var u = 'https://tara-test.ria.ee/oidc/authorize?' + qs.stringify({
    redirect_uri: 'https://tarademo.herokuapp.com/Callback',
    scope: 'openid',
    state: token,
    response_type: 'code',
    client_id: CLIENT_ID
  });
  console.log('--- Autentimispäring:');
  console.log(u);
  res.redirect(u);
});

// Tagasipöördumispunkt, parsib autoriseerimiskoodi
// ja pärib identsustõendi
app.get('/Callback', (req, res) => {

  console.log('--- Tagasipöördumispunkt:');

  const code = req.query.code;
  console.log('volituskood: ', code);

  const returnedState = req.query.state;
  console.log('tagastatud state: ', returnedState);

  // request mooduli kasutamisega
  var options = {
    url: 'https://tara-test.ria.ee/oidc/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + B64_VALUE
    },
    form: {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': 'https://tarademo.herokuapp.com/Callback'
    }
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log('Viga identsustõendi pärimisel: ', error);
        res.send(JSON.stringify(error));
        return;
      }
      if (response) {
        console.log('Identsustõendi pärimine - statusCode: ', response.statusCode);
      }
      var saadudAndmed = JSON.parse(body);
      var id_token = saadudAndmed.id_token;
      console.log('Saadud identsustõend: ', id_token);

      // Identsustõendi valideerimine
      jwt.verify(id_token, avalikVotiPEM, function (err, verifiedJwt) {
        if (err) {
          console.log(err);
        } else {
          console.log('Valideerimine edukas');
          console.log(verifiedJwt); // Will contain the header and body
          res.status(200)
            .render('pages/autenditud', { toend: verifiedJwt });

        }
      });

      // res.send(saadudAndmed.id_token);
    });

});

// Veebiserveri käivitamine
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});


