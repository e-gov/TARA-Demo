/*
  TARA-Demo - autentimisteenuse TARA kasutamist demonstreeriv Node.js rakendus

  Priit Parmakson, 2017-2018
*/

'use strict';

/* Vajalike teekide laadimine */

/* Veebiraamistik Express */
const express = require('express');

/* HTTP päringu parsimisvahendid */
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const qs = require('query-string');

/* Juhusõne genereerimise vahend*/
const uid = require('rand-token').uid;

/* Node.js krüptoteek */
const crypto = require('crypto');
/* Vali räsialgoritm - SHA256 */
const hash = crypto.createHash('sha256');

/* HTTP päringute töötluse teek */
const requestModule = require('request');

/* HTTP päringute silumisvahend */
require('request-debug')(requestModule);

/* JWK PEM vormingusse teisendamise vahend */
const jwkToPem = require('jwk-to-pem');

/* Veebitõendi (JWT) töötlusvahend. Kasutame identsustõendi kontrollimisel */
var jwt = require('jsonwebtoken');

/* TARA testteenuse otspunktide URL-id */
/* Identsustõendi allkirjastamise avaliku võtme publitseerimispunkt */
const AV_VOTME_OTSPUNKT = 'https://tara-test.ria.ee/oidc/jwks';
/* Autoriseerimis- e autentimispäringu vastuvõtu otspunkt*/
const AUTR_OTSPUNKT = 'https://tara-test.ria.ee/oidc/authorize?';
/* Identsustõendi väljastamise otspunkt */
const IDTOENDI_OTSPUNKT = 'https://tara-test.ria.ee/oidc/token';

/* Klientrakenduse TARA-Demo parameetrid */
/* Tagasisuunamis-URL */
const REDIRECT_URL = 'https://tarademo.herokuapp.com/Callback';
/* Klientrakenduse identifikaator */
const CLIENT_ID = 'ParmaksonResearch';

/ TARA identsustõendi allkirjastamise avalik võti PEM-vormingus */
var avalikVotiPEM;
/* Päri TARA identsustõendi allkirjastamise avalik võti. Eeldame, et päring võtme publitseerimise otspunkti 
 jõutakse teha enne, kui kasutaja nupule vajutab. Jah, race condition. See on demos puuduseks. */
var options = {
  url: AV_VOTME_OTSPUNKT,
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

/* Veebiserveri ettevalmistamine */
const app = express();
app.use(cookieParser());
/* Kui Heroku keskkonnamuutujas ei ole määratud teisiti,
 siis kasutatakse porti 5000. */
app.set('port', (process.env.PORT || 5000));

/* Sea juurkaust, millest serveeritakse sirvikusse ressursse
 vt http://expressjs.com/en/starter/static-files.html 
 ja https://expressjs.com/en/4x/api.html#express.static */
app.use(express.static(__dirname + '/public'));

/* Sea rakenduse vaadete (kasutajale esitatavate HTML-mallide) kaust */
app.set('views', __dirname + '/views');

/* Määra kasutatav mallimootor */
app.set('view engine', 'ejs');

/* Vajalik seadistus MIME-tüübi application/json 
parsimiseks */
app.use(bodyParser.json());

/* Vajalik seadistus MIME-tüübi
 application/x-www-form-urlencoded parsimiseks */
app.use(bodyParser.urlencoded({ extended: true }));

/* Võta keskkonnamuutujasse salvestatud salasõna */
var CLIENT_SECRET = process.env.CLIENT_SECRET;
console.log('CLIENT_SECRET: ' + CLIENT_SECRET);

/* Valmista HTTP Authorization päise väärtus */
const B64_VALUE = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64');

/* Järgnevad marsruuteri töötlusreeglid
*/

/* Päri TARA identsustõendi allkirjastamise avalik võti */
app.get('/voti', function (req, res) {
  var options = {
    url: AV_VOTME_OTSPUNKT,
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

/* Esilehe kuvamine */
app.get('/', function (req, res) {
  res.render('pages/index');
});

/* Autentimispäringu saatmine */
app.get('/auth', (req, res) => {

  /* Taasesitusründe vastase kaitsetokeni (state) genereerimine.
    Kõigepealt moodusta 16-tärgine juhusõne (tähed-numbrid),
    mis pannakse küpsisesse
  */
  var rString = uid(16);
  /* Arvuta räsi */
  hash.update(rString);
  var state = hash.digest('base64');
  console.log('state: ' + state);

  /* Moodusta autentimispäringu URL, lükkides otspunkti URL-le
    OpenID Connect protokollikohased query-parameetrid */
  var u = AUTR_OTSPUNKT + qs.stringify({
    redirect_uri: REDIRECT_URL,
    scope: 'openid',
    state: state,
    response_type: 'code',
    client_id: CLIENT_ID
  });
  console.log('--- Autentimispäring:');
  console.log(u);

  /* Saada autentimispäring (sirviku ümbersuunamiskorraldusega).
     Ümbersuunamiskorraldusega salvestatakse sirvikusse küpsis.
  */
  /* Küpsise suvandid */
  var cOptions = {
    httpOnly: true // Küpsis loetav ainult veebiserverile
  }
  res
    .cookie('TARA-Demo', rString, cOptions)
    .redirect(u);
});

/* Tagasipöördumispunkt, parsib autoriseerimiskoodi
  ja pärib identsustõendi */
app.get('/Callback', (req, res) => {

  console.log('--- Tagasipöördumispunkt:');

  /* Võta päringu query-osast TARA poolt saadetud volituskood (authorization code) */
  const code = req.query.code;
  console.log('volituskood: ', code);

  /* Võta TARA poolt tagastatud kaitsetokeni state väärtus */
  const returnedState = req.query.state;
  console.log('tagastatud state: ', returnedState);

  /* Võta päringuga kaasatulnud küpsis */
  if (!req.cookies['TARA-Demo']) {
    // Tagasipöördumispäringuga ei tulnud küpsist
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: 'Tagasipöördumispäringuga ei tulnud küpsist'
        });
    return;
  };
  var c = req.cookies['TARA-Demo'];
  console.log('Tagasitulnud küpsis: ' + c);

  /* Kaitsetokeni state samasuse kontroll */
  /* Arvuta räsi */
  hash.update(c);
  var computedState = hash.digest('base64');
  console('Arvutatud state: ' + computedState);

  if (computedState != returnedState) {
    // Saadetud ja tulnud state väärtused ei ühti
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: 'Saadetud ja tulnud state väärtused ei ühti'
        });
    return;
  }

  res
    .status(200)
    .render('pages/autenditud', { toend: verifiedJwt });

  /* Identsustõendi pärimine, request mooduli kasutamisega */
  var options = {
    url: IDTOENDI_OTSPUNKT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + B64_VALUE
    },
    form: {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': REDIRECT_URL
    }
  };

  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log('Viga identsustõendi pärimisel: ', error);
        res
          .status(200)
          .render('pages/ebaedu',
            { veateade: 'Viga identsustõendi pärimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log('Identsustõendi pärimine - statusCode: ', response.statusCode);
      }
      var saadudAndmed = JSON.parse(body);
      var id_token = saadudAndmed.id_token;
      console.log('Saadud identsustõend: ', id_token);

      // Identsustõendi kontrollimine
      jwt.verify(id_token, avalikVotiPEM, function (err, verifiedJwt) {
        if (err) {
          console.log('Identsustõendi kontrollimine ebaedukas');
          console.log(err);
          res
            .status(200)
            .render('pages/ebaedu', { veateade: 'Identsustõendi kontrollimisel ilmnes: ' + err });
        } else {
          console.log('Identsustõendi kontrollimine edukas');
          res
            .status(200)
            .render('pages/autenditud', { toend: verifiedJwt });
        }
      });

    });

});

/* Veebiserveri käivitamine */
app.listen(app.get('port'), function () {
  console.log('---- Node rakendus käivitatud ----');
});


