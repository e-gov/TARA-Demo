TARA-Demo demonstreerib, kuidas asutuse e-teenust ühendada autentimisteenusega TARA (TARA serverrakendusega).

TARA-Demo on klientrakendus, mis on kirjutatud Node.js-s, majutatud Heroku pilveteenusesse ja ühendatud TARA testkeskkonnaga.

Käivitamine: [https://tarademo.herokuapp.com](https://tarademo.herokuapp.com)

Kavas on TARA-Demo ühendada eIDAS-Client abikomponendi abil ka RIA eIDAS konnektorteenusega (vt allolev skeem). Siis hakkab TARA-Demo demonstreerima ka kuidas välismaalase autentimist vajav asutuse e-teenus saab otse ühenduda RIA eIDAS konnektorteenuse külge.

<img src='public/img/SKEEM.PNG' style='width:300px;'>

Demo on mõeldud tehniliste lahenduste näitamiseks. Sõltuvalt TARA teenuse ja RIA eIDAS konnektorteenuse seadistusest saab demos kasutada kas reaalseid või testandmeid. Kui teenused on häälestatud kasutama testandmeid, siis tuleb proovimisel kasutada test-ID-kaarte ja [numbreid Mobiil-ID testimiseks](https://www.id.ee/?id=36373).

