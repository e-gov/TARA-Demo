# TARA-Demo

## Ülevaade

TARA-Demo on rakendus, millega saab proovida autentimisteenuse TARA kasutamist.

TARA-Demo saab ühendada nii TARA test- või toodangukeskkonnaga. Testkeskkonnaga ühendatud TARA-Demo on üles pandud aadressil [https://tarademo.herokuapp.com](https://tarademo.herokuapp.com) ja seda saab kasutada igaüks. Toodangukeskkonnaga ühendatud TARA-Demo ei ole avalikkusele avatud.

Käesolev dokument esitab tarkvara kirjelduse ja juhised tarkvara paigaldamiseks, hooldamiseks ja kasutamiseks.

TARA-Demo on arendanud Riigi Infosüsteemi Amet.

## Tarkvara kirjeldus

TARA-Demo võimaldab:
- välja kutsuda autentimisteenust TARA
- vaadata autentimisteenuse TARA seisundit
- vaadata demoautentimiste logi (viimased 5 logimist)

TARA-Demo on Node.js veebirakendus.

TARA-Demo-l on järgmised liidesed (otspunkti täpsusega):

 URL  | otstarve
------|-----------
/voti |TARA identsustõendi allkirjastamise avalik võti
/first | "Your first login to Estonia" leht
/      | avaleht; esitab juhised TARA-Demo kasutamiseks
/auth  | autentimispäringu koostamine ja saatmine TARA-le
/Callback | tagasipöördumispäringu (callback) vastuvõtmine, identsustõendi pärimine ja kontrollimine ning kasutajale esitamine 
/logi | Demoautentimiste logi (5 viimast) kuvamine
/heartbeat | Päringu tegemine TARA elutukse otspunkti ja vastuse kuvamine

## Paigaldamine





