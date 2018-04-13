/*
  Logija
*/

/* HTTP kliendi teek */
const requestModule = require('request');

/*
  Google Apps veebirakendus, mis salvestab logi
*/
var LOGI_URL = 'https://script.google.com/macros/s/AKfycbyk1NNbHdgtRZCiNQLAedPOW8THdbLNQRPqZkkSw5VwrWu01Iw/exec';

exports.loeLogi = () => {
  console.log('--- Logi lugemine:');

  var options = {
    url: LOGI_URL,
    method: 'GET',
  };

  requestModule(
    options,
    function (error, response, body) {
      if (error) {
        console.log(' ebaedukas. Viga: ', error);
        res
          .render('pages/ebaedu', { veateade: 'Viga logi lugemisel: ' + JSON.stringify(error) });
        return;
      }
      if (response) {
        console.log(' Logi loetud. statusCode: ', response.statusCode);
        res
          .send(body);
      }
    });

}

exports.lisaKirje = (status, sub) => {
  console.log('--- Logikirje salvestamine:');

  var salvestatav_sub = sub || '-';

  var options = {
    url: LOGI_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'Staatus': status,
      'Subjekt': salvestatav_sub
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
        console.log(' Logitud. statusCode: ', response.statusCode);
      }
    });

}
