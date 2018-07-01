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
 *
 * @param {string} status - 'ALUSTA' või 'OK'
 * @param {string} [sub] - autenditud isiku identifikaator (isikukood vms)
 */
exports.lisaKirje = (status, sub) => {
  var salvestatav_sub = sub || '-';
  var options = {
    url: LOGI_URL,
    method: 'POST',
    headers: {
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
        console.log(' ebaedukas. Viga: ', error);
        res
          .render('pages/ebaedu', { veateade: 'Viga logimisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log(' LOGI. Saadud statusCode: ', response.statusCode);
        console.log(' LOGI. Saadud response: ', JSON.stringify(response));
        /* Täida ümbersuunamiskorraldus */
        if (response.statusCode == '302') {
          /* Loe Location päis */

        }
      }
    });
}
