---
permalink: Kirjeldus
---

# TARA-Demo kirjeldus

Kasulikku teavet, kui soovite rakenduse ise üles panna või oma arenduses eeskujuks võtta. 

TARA-Demo on kirjutatud Node.js-s ja majutatud Heroku pilves.

## Tegevused Heroku veebi-dashboard-is

`https://dashboard.heroku.com/apps`

Avage Herokus endale konto.

Tehke uus rakendus (siin nimega `tarademo`).

## Tegevused Heroku CLI-s

Eeldus: Heroku CLI on paigaldatud lokaalsesse masinasse.

Heroku CLI käsud: https://devcenter.heroku.com/articles/using-the-cli 

Sisselogimine:

`heroku login` (seejärel kasutajanimi + parool)

Vaata millega on seotud:

`git remote -v`

Sidumine ümbernimetatud Heroku app-ga:

`git remote`

vt Git raamat:  https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes 

Deploy:

`git push heroku master`

Vaata, mitu masinat töötab:

`heroku ps`

Vaata, et vähemalt üks masin töötab:

`heroku ps:scale web=1`

Veebilehe avamine:

`heroku open`

Rakenduse lokaalne käivitamine

kui keskkonnamuutujaid ei kasuta, siis Node index 

vt https://devcenter.heroku.com/articles/heroku-local 

`heroku local web`

Lokaalse kasutajaliidese avamine veebisirvijas:

`http://localhost:5000`

Node.js rakenduse deploy-ne: 

https://devcenter.heroku.com/articles/getting-started-with-nodejs 

`app.json` - manifest format for describing web apps

Logide vaatamine:

`heroku logs`

filtriga:

`heroku logs --source app -n 10`

Logimisest vt https://devcenter.heroku.com/articles/logging 

Keskkonnaparameetrite (konf-i) seadmine:

`heroku config`

`heroku config:set VAR=väärtus`

`heroku config:get VAR`

`heroku config:unset VAR`

Vt https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars 

