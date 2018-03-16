# TARA-Demo

TARA-Demo on klientrakendus, mis demonstreerib asutuse e-teenuse ühendamist autentimisteenusega TARA.

Käivitamine: [https://tarademo.herokuapp.com](https://tarademo.herokuapp.com)

Demos saab kasutada kas reaalseid või testandmeid. See sõltub TARA teenuse ja RIA eIDAS konnektorteenuse seadistusest. 

Kui TARA teenus ja RIA eIDAS konnektorteenus on häälestatud kasutama testandmeid, siis tuleb proovimisel kasutada test-ID-kaarte ja [numbreid Mobiil-ID testimiseks](https://www.id.ee/?id=36373).

TARA-Demo on kirjutatud Node.js-s ja majutatud Heroku pilveteenusesse.

### Tulemas

Läheiajal ühendame TARA-Demo eIDAS-Client abikomponendi abil ka RIA eIDAS konnektorteenusega (vt allolev skeem). Siis hakkab TARA-Demo näitama ka  välismaalase autentimist e-teenuse otseühendumisega RIA eIDAS konnektorteenuse külge.

<img src='public/img/SKEEM.PNG' style='width:250px;'>


