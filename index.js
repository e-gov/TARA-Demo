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
/* Määra räsialgoritm - SHA256 */
const HASH_ALGO = 'sha256';

/* HTTP kliendi teek
  Vt https://www.npmjs.com/package/request 
*/
const requestModule = require('request');

/* HTTP päringute silumisvahend.
  Vajadusel lülita sisse.
*/
// require('request-debug')(requestModule);

/* JWK PEM vormingusse teisendamise vahend */
const jwkToPem = require('jwk-to-pem');

/* Veebitõendi (JWT) töötlusvahend. Kasutame identsustõendi kontrollimisel */
var jwt = require('jsonwebtoken');

/**
 * Paigalduse tüübi ja kasutaja salasõna, seejärel
 * ka otspunktide URL-de ja rakenduse parameetrite
 * sisselugemine Heroku keskkonnamuutujatest.
 * Keskkonnamuutujates hoiame väärtusi, mis sõltuvad
 * paigalduse tüübist (TEST, TOODANG).
*/
const PAIGALDUSETYYP = (process.env.PAIGALDUSETYYP || 'UNDEFINED');
const KASUTAJASALASONA = process.env.KASUTAJASALASONA;
   
/* TARA otspunktide URL-id */
/* Identsustõendi allkirjastamise avaliku võtme publitseerimispunkt */
const AV_VOTME_OTSPUNKT = process.env.AV_VOTME_OTSPUNKT;
/* Autoriseerimis- e autentimispäringu vastuvõtu otspunkt*/
const AUTR_OTSPUNKT = process.env.AUTR_OTSPUNKT;
/* Identsustõendi väljastamise otspunkt */
const IDTOENDI_OTSPUNKT = process.env.IDTOENDI_OTSPUNKT;
/* TARA olulised parameetrid */
const ISSUER = process.env.ISSUER;

/* Klientrakenduse TARA-Demo parameetrid */
/* Klientrakenduse identifikaator */
const CLIENT_ID = process.env.CLIENT_ID;
/* Tagasisuunamis-URL */
const REDIRECT_URL = process.env.REDIRECT_URL;

/* Kellade maks lubatud erinevus identsustõendi kontrollimisel */
const CLOCK_TOLERANCE = 10;

/ TARA identsustõendi allkirjastamise avalik võti PEM-vormingus */
var avalikVotiPEM;
/**
 * Päri TARA identsustõendi allkirjastamise avalik võti.
 * Pärime rakenduse käivitamisel üks kord, puhverdame ja 
 * kasutame hiljem kõigis autentimistes. NB! Puhvrit ei
 * värskendata. Tootmiskõlbulikus rakenduses tuleks
 * teostada puhvri värskendamine.
 * Eeldame, et päring võtme publitseerimise otspunkti 
 * jõutakse teha enne, kui kasutaja nupule vajutab. Jah,
 * see on race condition. See on demos puuduseks.
*/
var options = {
  url: AV_VOTME_OTSPUNKT,
  method: 'GET'
};
requestModule(
  options,
  function (error, response, body) {
    if (error) {
      console.log('TARA-Demo: viga avaliku võtme pärimisel: ', error);
      res.send('Viga avaliku võtme pärimisel: ' + JSON.stringify(error));
      return;
    }
    if (response) {
      console.log('TARA-Demo: avaliku võtme pärimine - statusCode: ',
       response.statusCode);
    }
    var saadudVotmed = JSON.parse(body);
    var avalikVoti = saadudVotmed.keys[0];
    console.log('TARA-Demo: saadud avalik võti: ', avalikVoti);
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
/* NB! Vältida salasõna avalikukstulekut logi kaudu */
// console.log('CLIENT_SECRET: ' + CLIENT_SECRET);

/* Valmista HTTP Authorization päise väärtus */
const B64_VALUE = new Buffer(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64');

/**
 *  Järgnevad marsruuteri töötlusreeglid
 */

/**
 * Päri TARA identsustõendi allkirjastamise avalik võti
 * ja kuva kasutajale
 */
app.get('/voti', function (req, res) {
  console.log('TARA-Demo: identsustõendi allkirjastamise avaliku võtme pärimine:');
  var options = {
    url: AV_VOTME_OTSPUNKT,
    method: 'GET'
  };
  requestModule(
    options,
    (error, response, body) => {
      if (error) {
        console.log('TARA-Demo: ebaedukas. Viga: ', error);
        res
          .render('pages/ebaedu', { veateade: 'Viga avaliku võtme pärimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log('TARA-Demo: statusCode: ', response.statusCode);
      }
      var saadudVotmed = JSON.parse(body);
      var avalikVoti = saadudVotmed.keys[0];
      console.log('TARA-Demo: saadud avalik võti: ', avalikVoti);
      res
        .send('Saadud avalik võti: ' +
          JSON.stringify(avalikVoti));
    });
});

/**
 * Kuva "Your first login to Estonia" leht
 */
app.get('/first', function (req, res) {
  res.render('pages/first');
})

/**
 * Esilehe kuvamine
 */
app.get('/', function (req, res) {
  res.render('pages/index', {
    paigalduseTyyp: PAIGALDUSETYYP
  });
});

/**
 * Autentimispäringu saatmine,
 * vastavalt skoobile (scope=openid v eidasonly)
 * ja salasõnale (salasona=..).
 */
app.get('/auth', (req, res) => {

  console.log('TARA-Demo: otspunkt /auth');

  var salasona = req.query.salasona;
  var lihtnescope = req.query.scope;
  console.log('TARA-Demo: salasona = ' + salasona);

  // Kontrolli salasõna
  if ((PAIGALDUSETYYP == 'TOODANG') && (salasona !== KASUTAJASALASONA)) {
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: 'Tagasi lükatud' + ': ' + 'Salasõna puudu või vale'
        });
    return;
  }

  /**
   * Selgita, kas saadud skoop on all või eidas ja moodusta vastavalt
   * TARA-sse pöördumisel kasutatav skoop
  */
  var scope;
  var locale;
  if (lihtnescope == 'eidas') {
    scope = 'openid eidasonly';
    locale = 'en';
  } else {
    scope = 'openid';
    locale = 'et';
  }

  /*
   Taasesitusründe vastase kaitsetokeni (state) genereerimine.
   Kõigepealt moodusta 16-tärgine juhusõne (tähed-numbrid),
   mis pannakse küpsisesse
   */
  var rString = uid(16);
  console.log('TARA-Demo: küpsisesse pandav juhusõne: ' + rString);
  /* Arvuta räsi */
  var state = crypto.createHash(HASH_ALGO)
    .update(rString)
    .digest('base64');
  console.log('TARA-Demo: state: ' + state);

  /*
   Moodusta autentimispäringu URL, lükkides otspunkti URL-le
   OpenID Connect protokollikohased query-parameetrid
   */
  console.log('TARA-Demo: autentimispäring:');
  var u = AUTR_OTSPUNKT + qs.stringify({
    redirect_uri: REDIRECT_URL,
    scope: scope,
    state: state,
    response_type: 'code',
    client_id: CLIENT_ID,
    locale: locale
  });
  console.log(u);

  /*
   Saada autentimispäring (sirviku ümbersuunamiskorraldusega).
   Ümbersuunamiskorralduse mõjul salvestatakse sirvikusse küpsis.
   */
  /* Küpsise suvandid */
  var cOptions = {
    httpOnly: true // Küpsis loetav ainult veebiserverile
  }
  res
    .cookie('TARA-Demo', rString, cOptions)
    .redirect(u);
});

/**
 * Tagasisuunamispäringu (callback) vastuvõtmine,
 * identsustõendi pärimine ja kontrollimine ning
 * kasutajale esitamine 
 */
app.get('/Callback', (req, res) => {

  console.log('TARA-Demo: tagasisuunamispäringu töötlemine:');

  /* Kontrolli, kas TARA saatis veateate */
  
  if (req.query.error) {
    const error = req.query.error;
    const error_description = req.query.error_description;
    console.log('TARA-Demo: saadud veateade: ', error);  
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: error + ': ' + error_description
        });
    return;
  }

  /* Võta päringu query-osast TARA poolt saadetud volituskood (authorization code) */
  const code = req.query.code;
  console.log('TARA-Demo: saadud volituskood: ', code);

  /* Võta TARA poolt tagastatud kaitsetokeni state väärtus */
  const returnedState = req.query.state;
  console.log('TARA-Demo: saadud state: ', returnedState);

  /* Võta päringuga kaasatulnud küpsis */
  if (!req.cookies['TARA-Demo']) {
    // Tagasisuunamispäringuga ei tulnud küpsist
    console.log('TARA-Demo: viga: Tagasisuunamispäringuga ei tulnud küpsist');
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: 'Tagasisuunamispäringuga ei tulnud küpsist'
        });
    return;
  };
  var c = req.cookies['TARA-Demo'];
  console.log('TARA-Demo: saadud küpsis: ' + c);

  /*
   Turvaelemendi state kontroll
  */
  console.log('TARA-Demo: turvaelemendi state kontroll:');
  /* Arvuta räsi */
  var computedState = crypto.createHash(HASH_ALGO)
    .update(c)
    .digest('base64');
  console.log('TARA-Demo: arvutatud state: ' + computedState);
  if (computedState != returnedState) {
    // Saadetud ja saanud state väärtused ei ühti
    console.log('TARA-Demo: ebaedukas');
    res
      .status(200)
      .render(
        'pages/ebaedu',
        {
          veateade: 'Saadetud ja tulnud state väärtused ei ühti'
        });
    return;
  } else {
    console.log('TARA-Demo: edukas');
  }

  /*
   Identsustõendi pärimine, kontroll ja kuvamine,
   request teegi kasutamisega
  */
  console.log('TARA-Demo: identsustõendi pärimine:');
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
        console.log('TARA-Demo: ebaedukas. Viga: ', error);
        res
          .status(200)
          .render('pages/ebaedu',
            { veateade: 'Viga identsustõendi pärimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log('TARA-Demo: edukas. statusCode: ', response.statusCode);
      }
      var saadudAndmed = JSON.parse(body);
      var id_token = saadudAndmed.id_token;
      console.log('TARA-Demo: saadud identsustõend: ',
        JSON.stringify(id_token));

      /* Logi saadud võtmeidentifikaator */
      console.log('TARA-Demo: saadud võtmeidentifikaator: ' + saadudAndmed.kid);

      /*
       Identsustõendi kontrollimine. Teegi jsonwebtoken
       abil kontrollitakse allkirja, tõendi saajat (aud), tõendi
       väljaandjat (iss) ja tõendi kehtivust (nbf ja exp).
       Vt https://www.npmjs.com/package/jsonwebtoken
      */
      console.log('TARA-Demo: identsustõendi kontrollimine:');
      jwt.verify(
        id_token, // Kontrollitav tõend
        avalikVotiPEM, // Allkirja avalik võti
        {
          audience: CLIENT_ID, // Tõendi saaja
          issuer: ISSUER, // Tõendi väljaandja
          clockTolerance: CLOCK_TOLERANCE // Kellade max lubatud erinevus
        },
        function (err, verifiedJwt) {
          if (err) {
            console.log('TARA-Demo: ebaedukas');
            console.log(err);
            res
              .status(200)
              .render('pages/ebaedu', { veateade: 'Identsustõendi kontrollimisel ilmnes viga: ' + err });
          } else {
            console.log('TARA-Demo: edukas');
            console.log('TARA-Demo: identsustõendi sisu: ',
              JSON.stringify(verifiedJwt));

            res
              .status(200)
              .render('pages/autenditud',
               {
                 ilustoend: JSON.stringify(verifiedJwt, null, 2),
                 toend: verifiedJwt
                });
          }
        });

    });

});

/**
 * Veebiserveri käivitamine 
 */
app.listen(app.get('port'), function () {
  console.log('TARA-Demo: Node.js rakendus käivitatud ----');
});


