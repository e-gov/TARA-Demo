### Ülespanek ja käitamine Heroku pilves

TARA-Demo on tööle pandud Heroku pilves. Kui soovite ülespanekut ise läbi teha, siis leiate abi järgnevast meelespeast.
 
__avage konto__. Avage Herokus endale tasuta konto.

__tehke uus rakendus__. Heroku veebi-dashboard-is https://dashboard.heroku.com/apps tehke uus rakendus (siin nimega `tarademo`).

abi: [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) 

__paigaldage CLI__. Paigaldage Heroku CLI lokaalsesse masinasse.

abi: [Heroku CLI käsud](https://devcenter.heroku.com/articles/using-the-cli)

__kloonige TARA-Demo git repo lokaalsesse masinasse__.

__logige sisse__. Liikuge CLI-s (või IDE integreeritud terminalis) git repo kausta. Sisestage `heroku login` (seejärel kasutajanimi + parool)

__siduge git repo Heroku repoga__. Vaadake, millega repo on seotud: `git remote -v`.<br> Sidumine: `git remote`.<br><br> abi: [Git raamat](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

__laadige rakendus pilve__. `git push heroku master`

__võite vaadata, mitu masinat pilves töötab__. `heroku ps`

__avage rakenduse veebileht__. `heroku open`

__võite käivitada rakenduse lokaalselt__. `heroku local web`.<br><br> abi: [Heroku local](https://devcenter.heroku.com/articles/heroku-local)

__lokaalse kasutajaliidese avamine sirvikus__. `http://localhost:5000`

__logide vaatamine__. `heroku logs`.<br><br> Filtriga: `heroku logs --source app -n 10`.<br><br> abi: [Logimisest](https://devcenter.heroku.com/articles/logging) 

__seadke keskkonnamuutujad__ (vajate klientrakenduse salasõna CLIENT_SECRET seadmist).  `heroku config`<br> `heroku config:set VAR=väärtus`<br> `heroku config:get VAR`<br> `heroku config:unset VAR`.<br><br> abi: [Configuration variables](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) 

