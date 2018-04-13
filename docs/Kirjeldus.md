### Lähemalt TARA-Demo rakendusest

TARA-Demo on kirjutatud Node.js-s.

Rakenduse kood on peamiselt failis `index.js`. Soovitame uurida koodi ja tutvuda sealsete kommentaaridega.

Ülevaade marsruutidest

marsruut  | ülesanne
----------|-----------
GET /voti | Päri TARA identsustõendi allkirjastamise avalik võti 
GET /     | Esilehe kuvamine
GET /auth | Autentimispäringu saatmine
GET /callback | Tagasipöördumispunkt, parsib autoriseerimiskoodi ja pärib identsustõendi
GET /stat | Logi kuvamine (edaspidi lisandub kasutusstatistika)
