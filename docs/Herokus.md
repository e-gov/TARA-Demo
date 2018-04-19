### Ülespanek ja käitamine Heroku pilves

TARA-Demo on tööle pandud Heroku pilves. Kui soovite ülespanekut ise läbi teha, siis leiate abi järgnevast meelespeast. 

&nbsp; | &nbsp; 
--|--
`git clone https://github.com/e-gov/TARA-Demo` | Kloonige TARA-Demo git repo lokaalsesse masinasse.
&nbsp; | [registreerige oma klientrakendus](docs/Registreerimine.md)
&nbsp; | Avage Herokus konto.
 https://dashboard.heroku.com/apps | Heroku veebi-dashboard-is  tehke uus rakendus (siin nimega `tarademo`). abi: [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
&nbsp; | redigeerige välja või muutke logimine (logitakse eraldi Google Apps rakendusse)
&nbsp; | Paigaldage Heroku CLI lokaalsesse masinasse. abi: [Heroku CLI käsud](https://devcenter.heroku.com/articles/using-the-cli)
`heroku login` | Logige sisse. Liikuge CLI-s (või IDE integreeritud terminalis) git repo kausta. Sisestage `heroku login` (seejärel kasutajanimi + parool)
`git remote -v` | Vaadake, millega repo on seotud: 
`git remote rm heroku`<br><br>`git remote add heroku https://git.heroku.com/tara-java.git`| Heroku rakenduse ümbernimetamisel tuleb repo git-side Herokuga uuesti seada. Eemaldage vana side<br><br>ja lisage uus<br><br> abi: [Git raamat](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
`git push heroku master` | Laadige rakendus pilve.
`git push -f heroku master` | Laadige rakendus pilve, kirjutades varasema üle
`heroku ps` | Võite vaadata, mitu masinat pilves töötab.
`heroku open` | Avage rakenduse veebileht. 
`heroku local web` | Võite käivitada rakenduse lokaalselt. abi: [Heroku local](https://devcenter.heroku.com/articles/heroku-local)
`http://localhost:5000` | Lokaalse kasutajaliidese avamine sirvikus.
`heroku logs` | Kuva logi 
`heroku logs --source app` | Kuva ainult rakenduse logi. abi: [Logimisest](https://devcenter.heroku.com/articles/logging) 
`heroku config`<br> `heroku config:set VAR=väärtus`<br> `heroku config:get VAR`<br> `heroku config:unset VAR`<br> | Seadke keskkonnamuutujad (vajate klientrakenduse salasõna CLIENT_SECRET seadmist). abi: [Configuration variables](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) 
