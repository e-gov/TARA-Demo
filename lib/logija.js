/*
  Logija
*/

/* HTTP kliendi teek */
const requestModule = require('request');

/*
  Google Apps veebirakendus, mis salvestab logi
*/

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
