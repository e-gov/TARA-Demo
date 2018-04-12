### Ülespanek ja käitamine Heroku pilves

TARA-Demo on tööle pandud Heroku pilves. Kui soovite ülespanekut ise läbi teha, siis leiate abi järgnevast meelespeast.
 
Avage konto. Avage Herokus endale tasuta konto.

Tehke uus rakendus. Heroku veebi-dashboard-is https://dashboard.heroku.com/apps tehke uus rakendus (siin nimega `tarademo`). abi: [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) 

Paigaldage CLI. Paigaldage Heroku CLI lokaalsesse masinasse. abi: [Heroku CLI käsud](https://devcenter.heroku.com/articles/using-the-cli)

Kloonige TARA-Demo git repo lokaalsesse masinasse.

Logige sisse. Liikuge CLI-s (või IDE integreeritud terminalis) git repo kausta. Sisestage `heroku login` (seejärel kasutajanimi + parool)

Siduge git repo Heroku repoga. Vaadake, millega repo on seotud: `git remote -v`. Sidumine: `git remote`. abi: [Git raamat](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

Laadige rakendus pilve. `git push heroku master`

Võite vaadata, mitu masinat pilves töötab. `heroku ps`

Avage rakenduse veebileht. `heroku open`

Võite käivitada rakenduse lokaalselt. `heroku local web`. abi: [Heroku local](https://devcenter.heroku.com/articles/heroku-local)

Lokaalse kasutajaliidese avamine sirvikus. `http://localhost:5000`

Logide vaatamine. `heroku logs`.<br><br> Filtriga: `heroku logs --source app -n 10`. abi: [Logimisest](https://devcenter.heroku.com/articles/logging) 

Seadke keskkonnamuutujad (vajate klientrakenduse salasõna CLIENT_SECRET seadmist). `heroku config` `heroku config:set VAR=väärtus` `heroku config:get VAR` `heroku config:unset VAR`. abi: [Configuration variables](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) 

