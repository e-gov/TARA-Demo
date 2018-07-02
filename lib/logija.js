/*
  Logija - salvestab logikirje Google Apps
  veebirakenduses hoitavasse logisse
*/

/* HTTP kliendi teek */
const requestModule = require('request');

/* Logi hoidva Google Apps rakenduse URL */
var LOGI_URL = 'https://script.google.com/macros/s/AKfycbyk1NNbHdgtRZCiNQLAedPOW8THdbLNQRPqZkkSw5VwrWu01Iw/exec';

/* Võta keskkonnamuutujasse salvestatud salasõna */
var LOG_SECRET = process.env.LOG_SECRET;

/*
 * Logib autentimise alustamisi ja edukaid lõpuleviimisi.
 * Saadab GET meetodiga Google Apps Script veebiäppi. 
 *
 * @param {string} status - 'OK'
 * @param {string} sub - autenditud isiku identifikaator (isikukood vms)
 * @param {string} given_name - autenditud isiku eesnimi
 * @param {string} family_name - autenditud isiku perekonnanimi
 */
exports.lisaKirje = (status, sub, given_name, family_name) => {
  const salvestatav_sub = sub || '-';
  const saadetav_url = LOGI_URL + '?' +
    'staatus=' + status +
    '&isikukood=' + salvestatav_sub +
    '&eesnimi=' + given_name + 
    '&perenimi=' + family_name;
  console.log(' Logija: Saadetav URL:');
  console.log(saadetav_url);
  const options = {
    url: saadetav_url,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
      'followOriginalHttpMethod': true,
    }
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log(' Logimine. Viga: ', error);
        res
          .render('pages/ebaedu', { veateade: 'Viga logimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log(' Logija: Saadud statusCode: ', response.statusCode);
        // console.log(' Logija: Saadud response: ');
        // console.log(JSON.stringify(response, null, 2));
        // console.log(' Logija: Saadud body: ', JSON.stringify(body));
        // console.log(' --- ');
        return;
        /* Täida ümbersuunamiskorraldus */
        if (response.statusCode == '302') {
          /* Loe Location päis */
          var redirect_url = response.headers.location;
          var redirect_options = {
            url: redirect_url,
            /* Google Web App ümbersuunamiskorraldus tuleb täita GET 
            meetodiga */
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
              'Staatus': status,
              'Subjekt': salvestatav_sub,
              'Salasõna': LOG_SECRET
            }
          };
          requestModule(
            redirect_options,
            function (error, response, body) {
              if (error) {
                console.log(' Logija: Viga: ', error);
                res
                  .render('pages/ebaedu', { veateade: 'Viga logimisel: ' + JSON.stringify(error) });
                return;
              }
              if (response) {
                console.log(' Logija: Redirect: Saadud statusCode: ', response.statusCode);
                console.log(' Logija: Saadud response: ');
                console.log(JSON.stringify(response, null, 2));
                if (error) {
                  console.log(' Logija: Saadud error: ', JSON.stringify(error));
                }
              }
            }
          );
        }
      }
    });
}

/*
 * Logib autentimise alustamisi ja edukaid lõpuleviimisi.
 * ARHIVEERITUD, kuna POST meetodiga Google Apps Script veebiäppi 
 * saatmine ei õnnestu.
 *
 * @param {string} status - 'ALUSTA' või 'OK'
 * @param {string} [sub] - autenditud isiku identifikaator (isikukood vms)
 */
exports.lisaKirjeARHIVEERITUD = (status, sub) => {
  var salvestatav_sub = sub || '-';
  var options = {
    url: LOGI_URL,
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
      'followOriginalHttpMethod': true,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'Staatus': status,
      'Subjekt': salvestatav_sub,
      'Salasõna': LOG_SECRET
    }
  };
  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log(' Logimine. Viga: ', error);
        res
          .render('pages/ebaedu', { veateade: 'Viga logimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log(' Logija: Saadud statusCode: ', response.statusCode);
        console.log(' Logija: Saadud response: ');
        console.log(JSON.stringify(response, null, 2));
        console.log(' Logija: Saadud body: ', JSON.stringify(body));
        console.log(' --- ');
        /* Täida ümbersuunamiskorraldus */
        if (response.statusCode == '302') {
          /* Loe Location päis */
          var redirect_url = response.headers.location;
          var redirect_options = {
            url: redirect_url,
            /* Google Web App ümbersuunamiskorraldus tuleb täita GET 
            meetodiga */
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
              'Staatus': status,
              'Subjekt': salvestatav_sub,
              'Salasõna': LOG_SECRET
            }
          };
          requestModule(
            redirect_options,
            function (error, response, body) {
              if (error) {
                console.log(' Logija: Viga: ', error);
                res
                  .render('pages/ebaedu', { veateade: 'Viga logimisel: ' + JSON.stringify(error) });
                return;
              }
              if (response) {
                console.log(' Logija: Redirect: Saadud statusCode: ', response.statusCode);
                console.log(' Logija: Saadud response: ');
                console.log(JSON.stringify(response, null, 2));
                if (error) {
                  console.log(' Logija: Saadud error: ', JSON.stringify(error));
                }
              }
            }
          );
        }
      }
    });
}
