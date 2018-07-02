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
  const saadetav_url = encodeURI(
    LOGI_URL + '?' +
    'staatus=' + status +
    '&isikukood=' + salvestatav_sub +
    '&eesnimi=' + given_name + 
    '&perenimi=' + family_name);
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
      }
    });
}

