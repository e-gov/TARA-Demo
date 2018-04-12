### Ülespanek ja käitamine Heroku pilves

TARA-Demo on tööle pandud Heroku pilves. Kui soovite ülespanekut ise läbi teha, siis leiate abi järgnevast meelespeast.

tegevus | juhis
--------|-------
konto avamine | Avage Herokus endale konto.
uue rakenduse tegemine | Heroku veebi-dashboard-is.https://dashboard.heroku.com/apps tehke uus rakendus (siin nimega `tarademo`).<br><br> Abiteave: [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) 
CLI paigaldamine | Paigaldage Heroku CLI lokaalsesse masinasse.<br><br> Abiteave: [Heroku CLI käsud](https://devcenter.heroku.com/articles/using-the-cli)
tehke lokaalses masinas git-repo |
liikuge CLI-s git-repo kausta |
logige sisse | `heroku login` (seejärel kasutajanimi + parool)
siduge git-repo Heroku repoga | Vaata, millega on seotud: `git remote -v`.<br> Sidumine: `git remote`.<br><br> Abiteave: [Git raamat](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
laadige rakendus pilve | `git push heroku master`
vaadake, mitu masinat töötab | `heroku ps`
avage rakenduse veebileht | `heroku open`
rakenduse lokaalne käivitamine | `heroku local web`.<br><br> Abiteave: [Heroku local](https://devcenter.heroku.com/articles/heroku-local)
lokaalse kasutajaliidese avamine sirvikus | `http://localhost:5000`
logide vaatamine | `heroku logs`.<br><br> Filtriga: `heroku logs --source app -n 10`.<br><br> Abiteave: [Logimisest](https://devcenter.heroku.com/articles/logging) 
sea keskkonnamuutujad | `heroku config`<br> `heroku config:set VAR=väärtus`<br> `heroku config:get VAR`<br> `heroku config:unset VAR`.<br><br> Abiteave: [Configuration variables](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars) 

