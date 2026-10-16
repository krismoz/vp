const express = require('express');
const dateTimeET = require('./src/dateTimeET.js');
const randomJpg = require('./src/pildid.js');
const fs = require('fs').promises;
//moodul andmebaasiga suhtlemiseks, koos async võimalustega
const mysql = require('mysql2/promise');
const bodyparser = require('body-parser');
//moodul keskkonnamuutujate lugemiseks
require('dotenv').config();

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';


//Käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express();
//Määrame veebilehe malide järgi renderdamise mootori (EJS)
app.set('view engine', 'ejs');
//Muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'));
//Hakkame päringuid parsima
app.use(bodyparser.urlencoded({extended: false}));

//Juhusliku pildi valimine
//Selle lahenduse sain ma ChatGPT abiga. Next(); ütleb programmile, et töö on tehtud ning võib edasi minna. Kui seda poleks siis programm jääks sinna kinni.
//res.locals lubab muutujat igalpool kasutada aga selle miinus on, et programm teeb seda koguaeg, isegi siis kui seda vaja ei ole. Ma ei tahtnud seda igale erinevale lehele kirja panna seega otsisin viisi seda "globally" kirja panna.
app.use(async (req, res, next) => {
    try {
        const randomJpgPicture = await randomJpg.randomJpgPicture();
        res.locals.randomJpgPicture = randomJpgPicture;
        next();
    } catch (err) {
        console.log(err);
        res.locals.randomJpgPicture = null;
        next();
    }
});

//avaleht
app.get('/', (req,res) => {
	//res.send('Express.js veeb käivitus!');
	const day = dateTimeET.dayET();
	const date = dateTimeET.dateET(Math.round(Math.random()))
	const time = dateTimeET.timeET();
	res.render('index', {day: day, date: date, time: time});
});

//vanasõnad
app.get('/vanasona', async (req, res) => {
	try{
		const data = await fs.readFile(textRef, 'utf8');
		let folkWisdom = data.split(';');
		let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];
		res.render('wisdom', {wisdom: wisdom});
	} catch(err){
		console.log(err);
		res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud...'});
	}
});

//faq
app.get('/faq', (req, res) => {
	res.render('faq');
});

//pildid
app.get('/photos', async (req, res) =>{
	try{
		const allJpgPictures = await randomJpg.allJpgPictures();
		res.render('photos', {allJpgPictures: allJpgPictures});
	} catch(err){
		res.render('photos', {allJpgPictures: '404'});
	}
});

//Välja commentitud app.get'id jne on viisid kuidas me lehtesid kuvasime enne kui läksime üle routeidele ja controlleritele.

//külastuse registreerimine
const visitRouter = require('./routes/visitRoutes');
app.use('/visits', visitRouter);

/*app.get('/visits', async (req, res) => {
	try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';'); //Eraldab sissekanded algul ; märgiga
		const lastVisit = visits[visits.length - 2]; //Kui sissekandeid on nt 5, siis nende arv on 6 ning 5 on tühi seega tuleb lahutada 2'ga, et saada päris sissekannet.
        const visitData = lastVisit.split(','); //Eraldab leitud sissekande ,'dega, et nimi, kuupäev ja kellaaeg eraldada.
		const userName = visitData[0];
		const userDate = visitData[1];
		const userTime = visitData[2];
		res.render('visits', {userName: userName, userDate: userDate, userTime: userTime});
    } catch (err) {
        console.log(err);
    }
});

app.get('/visits/regvisit', (req, res) =>{
	res.render('regvisit', {regMessage: ''});
});

app.post('/visits/regvisit', async (req, res) => {
	console.log(req.body);
	try{
		const date = dateTimeET.dateET(0);
		const time = dateTimeET.timeET();
		await fs.open(regTextRef, 'a'); // a - append, lisab lõppu(+loob faili kui juba ei ole) w - write, kirjutab üle(loob faili), r - read, ainult loeb.
		await fs.appendFile(regTextRef, req.body.nameInput + ',' + date + ',' + time + ';');
		res.render('regvisit', {regMessage: 'Salvestamine õnnestus!'});
	} catch{
		console.log(err);
		res.render('regvisit', {regMessage: 'Salvestamine ebaõnnestus...'});
	}
}); */

const etMovieRouter = require('./routes/etMovieRoutes');
app.use('/etmovies', etMovieRouter);

//Siin on vanad viisid kuidas lehtesid kuvasime enne kui läksime üle routeidele ja controlleritele.

//Eesti filmid
/* app.get('/etmovies', (req, res) => {
	res.render('etmovies');
}); */

//Eesti filmidega seotud isikud
/* app.get('/etmovies/movie_people', async (req, res) => {
	let connection; 
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const [sqlRes] = await connection.execute(sqlReq);
		console.log(sqlRes);
		res.render('movie_people', {personList: sqlRes});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('movie_people', {personList: []});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}); */

//Eesti filmidega seotud inimeste lisamine
/* app.get('/etmovies/extra_movie_people', (req, res) => {
	res.render('extra_movie_people', {notice: 'Ootan sisestust!', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
}); */

/* app.post('/etmovies/extra_movie_people', async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, teeme kõige lahjema kontrolli
	let deceasedDate = null;
	let deceasedDateTime = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
		deceasedDateTime = new Date(deceasedDate);
	}
	
	//sünnikuupäeva võrdlemine
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	
	//Eesnime kontroll
	if(!req.body.firstNameInput){
		console.log('Eesnimi puudub!');
		return res.render('extra_movie_people', {notice: 'Eesnimi puudub!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Perekonnanime kontroll
	else if(!req.body.lastNameInput){
		console.log('Perekonnanimi puudub!');
		return res.render('extra_movie_people', {notice: 'Perekonnanimi puudub!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Sünnikuupäeva kontroll
	else if(!req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log('Sünnikuupäev ei ole korrektne!');
		return res.render('extra_movie_people', {notice: 'Sünnikuupäev ei ole korrektne!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Surmakuupäeva kontroll
	// Kõik kontrollid on pandud sulgudes sisse selleks, et kui esimene kontroll on false ehk surmakuupäev on jäetud tühjaks siis && jätab kõik ülejäänud kontrollid vahele sest see teab, et ülejäänud ei saa ka true olla. Muidu tuleb getTime() error. ChatGPT aitas.
	// Kui on sisestatud surmakuupäev siis "deceasedDate != null" on true ja ta hakkab ülejäänut ka kontrollima.
	else if(deceasedDate != null && (isNaN(deceasedDateTime.getTime()) || deceasedDateTime > timeNow || deceasedDateTime < bornDate)){
		console.log('Surmakuupäev ei ole korrektne!');
		return res.render('extra_movie_people', {notice: 'Surmakuupäev ei ole korrektne!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await connection.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('extra_movie_people', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud.', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_movie_people', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}); */

//Eesti filmide sisestamine
/* app.get('/etmovies/extra_etmovies', (req, res) => {
	res.render('extra_etmovies', {notice:'Ootan sisestust!', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
});

app.post('/etmovies/extra_etmovies', async (req, res) => {
	console.log(req.body);
	if(!req.body.filmTitle){
		console.log('Filmi pealkiri puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi pealkiri puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmYear){
		console.log('Filmi väljastamise aasta puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi väljastmise aasta puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmDurationMinutes){
		console.log('Filmi kestvus minutites puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi kestvus minutites puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmDescription){
		console.log('Filmi kirjeldus puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi kirjeldus puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await connection.execute(sqlReq, [
			req.body.filmTitle,
			req.body.filmYear,
			req.body.filmDurationMinutes,
			req.body.filmDescription
		]);
		res.render('extra_etmovies', {notice: req.body.filmTitle + ' andmebaasi salvestatud.', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_etmovies', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
});

//Eesti filmidega seotud ametite lisamine
app.get('/etmovies/extra_etmovie_jobs', (req, res) => {
	res.render('extra_etmovie_jobs', {notice:'Ootan sisestust!', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
});

app.post('/etmovies/extra_etmovie_jobs', async (req, res) => {
	console.log(req.body);
	if(!req.body.movieJobTitle){
		console.log('Ameti nimetus puudub!');
		return res.render('extra_etmovie_jobs', {notice: 'Ameti nimetus puudub!', wrongMovieJobTitle: req.body.movieJobTitle, wrongMovieJobDescription: req.body.movieJobDescription});
	}
	else if(!req.body.movieJobDescription){
		console.log('Ameti kirjeldus puudub!');
		return res.render('extra_etmovie_jobs', {notice: 'Ameti kirjeldus puudub!', wrongMovieJobTitle: req.body.movieJobTitle, wrongMovieJobDescription: req.body.movieJobDescription});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';
		await connection.execute(sqlReq, [
			req.body.movieJobTitle,
			req.body.movieJobDescription
		]);
		res.render('extra_etmovie_jobs', {notice: 'Amet: "' + req.body.movieJobTitle + '" andmebaasi salvestatud.', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_etmovie_jobs', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}); */
app.listen(5313);
