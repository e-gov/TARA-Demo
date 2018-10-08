# TARA-Demo

## Ülevaade

TARA-Demo on rakendus, millega saab proovida autentimisteenuse TARA kasutamist.

Käesolev dokument esitab tarkvara kirjelduse ja juhised tarkvara paigaldamiseks, hooldamiseks ja kasutamiseks.

TARA-Demo on arendanud Riigi Infosüsteemi Amet.

## Tarkvara kirjeldus

### Ülevaade

TARA-Demo võimaldab:
- välja kutsuda autentimisteenust TARA
- vaadata autentimisteenuse TARA seisundit (elutukse).

TARA-Demo saab ühendada nii TARA test- kui ka toodangukeskkonnaga (vastavalt TEST ja TOODANG paigaldus).

Testkeskkonnaga ühendatud TARA-Demo on üles pandud aadressil [https://tarademo.herokuapp.com](https://tarademo.herokuapp.com) ja seda saab kasutada igaüks.

Toodangukeskkonnaga ühendatud TARA-Demo ei ole avalikkusele avatud.

TARA-Demo-l on järgmised liidesed (otspunkti täpsusega):

 URL  | otstarve
------|-----------
/      | avaleht; esitab juhised TARA-Demo kasutamiseks
/auth  | autentimispäringu koostamine ja saatmine TARA-le
/Callback | tagasipöördumispäringu (callback) vastuvõtmine, identsustõendi pärimine ja kontrollimine ning kasutajale esitamine 
/heartbeat | Päringu tegemine TARA elutukse otspunkti ja vastuse kuvamine
/voti |TARA identsustõendi allkirjastamise avalik võti
/first | "Your first login to Estonia" leht

TARA-Demo suhtleb 1 välise osapoolega:

väline osapool | selgitus
---------------|----------
autentimisteenus TARA | suhtlus toimub TARA otspunktidega, vastavalt TARA tehnilise kirjelduse nõuetele; paigaldamisel määratakse, kas ühendatakse TARA test- või toodanguteenusega

### Võtmed ja salasõnad

TARA-Demo paigaldamiseks ja käitamiseks on vaja järgmisi võtmeid ja salasõnu (saladusi):

võti v salasõna | otstarve, nõuded, genereerimine jm haldus
----------------|---------------------------------
kasutaja salasõna | piirab juurdepääsu TOODANG paigaldusele; tärgijada pikkusega vähemalt 16 tärki; määratakse TOODANG paigaldamisel
klientrakenduse salasõna | vastavalt TARA nõuetele; antakse klientrakenduse registreerimisel; TEST ja TOODANG paigaldised tuleb eraldi registreerida 

Kõik ülalnimetatud võtmed seatakse Node.js rakenduse paigaldamisel keskkonnaparameetrina (`process.env`).

### Sõltuvused 

sõltuvus | versioon | milleks vajalik
---------|----------|-----------------
Node.js  | 6.x      | veebirakenduse serveripool
express  | standardne | marsruuter
ejs      | standardne | templiiditeek
cookie-parser  | standardne | küpsisetöötlus
body-parser  | standardne | HTTP töötlus
query-string  | standardne | URL-itöötlus
request  | standardne | silumisvahend
jwk-to-pem  | standardne | JWT töötlus
jsonwebtoken  | standardne | JWT töötlus
HTML, CSS, Javascript | | veebirakenduse sirvikupool

Märkus. “Standardne” tähendab laialt kasutatavat, stabiilset teeki, millest npm abil paigaldatakse viimane versioon. Kui versioon on tühi, siis kasutatakse standardseid võimalusi, mis ei nõua sidumist konkreetse versiooniga.

## Paigaldamine

Käsitleme paigaldamist Heroku majutusteenusesse.

1 Loo Heroku konto.

2 Loo Heroku rakendus (_app_), valides rakendusele asjakohase nime.

3 Registreeri Herokus loodud rakendus TARA klientrakendusena (tee läbi RIA vastav protseduur).

4 Määra TARA-Demo repo Heroku rakenduse lähterepoks (vt juhiseid käesoleva repo vikis).

5 Sea Heroku rakenduse keskkonnamuutujad (`Config Vars`):

keskkonnamuutuja  | näiteväärtus | selgitus
------------------|--------------|-----------
`PAIGALDUSETYYP`    | `TEST`         | sisestage TEST või TOODANG
`AUTR_OTSPUNKT`     | `https://tara-test.ria.ee/oidc/authorize?` | vt TARA tehniline kirjeldus
`AV_VOTME_OTSPUNKT` | `https://tara-test.ria.ee/oidc/jwks` | vt TARA tehniline kirjeldus
`CLIENT_ID`         | `TARA-Demo` | klientrakenduse identifikaator
`CLIENT_SECRET`     | `ChangeIt`  | klientrakenduse salasõna
`IDTOENDI_OTSPUNKT` | `https://tara-test.ria.ee/oidc/token` | vt TARA tehniline kirjeldus
`ISSUER`            | `https://tara-test.ria.ee` | vt TARA tehniline kirjeldus
`KASUTAJASALASONA`  | `ChangeIt` | vajalik ainult TOODANG paigalduse puhul
`REDIRECT_URL`      | `https://tara-demo.herokuapp.com/Callback` | klientrakenduse tagasipöördumis-URL

6 Käivita rakendus.


