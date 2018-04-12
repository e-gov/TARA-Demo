### Ülespanek Heroku pilves

TARA-Demo on üles pandud Heroku pilves. Kui soovite seda korrata, siis leiate abi järgnevast meelespeast.

 |
--- | ---
konto avamine | Avage Herokus endale konto.
uue rakenduse tegemine | Heroku veebi-dashboard-is. Abiteave: [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) https://dashboard.heroku.com/apps tehke uus rakendus (siin nimega `tarademo`).
CLI paigaldamine | Paigaldage Heroku CLI lokaalsesse masinasse. Abiteave: 
[Heroku CLI käsud](https://devcenter.heroku.com/articles/using-the-cli)
tehte lokaalses masinas git-repo |
liikuge CLI-s git-repo kausta |
logige sisse | `heroku login` (seejärel kasutajanimi + parool)
siduge git-repo Heroku repoga | Vaata millega on seotud: `git remote -v`. Sidumine: `git remote`. Abiteave: [Git raamat](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
laadige rakendus pilve | `git push heroku master`
vaadake, mitu masinat töötab | `heroku ps`
avage rakenduse veebileht | `heroku open`
rakenduse lokaalne käivitamine | `heroku local web`. Abiteave: [Heroku local](
vt https://devcenter.heroku.com/articles/heroku-local)
lokaalse kasutajaliidese avamine sirvikus | `http://localhost:5000`
logide vaatamine | `heroku logs`. Filtriga: `heroku logs --source app -n 10`. 
Abiteave: [Logimisest](https://devcenter.heroku.com/articles/logging) 
sea keskkonnamuutujad | `heroku config`, 
`heroku config:set VAR=väärtus`, `heroku config:get VAR`, 
`heroku config:unset VAR`. Abiteave: [Configuration variables](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) 

