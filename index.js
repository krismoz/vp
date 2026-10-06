const express = require('express');
const dateTimeET = require('./src/dateTimeET.js');
const randomJpg = require('./src/pildid.js');
const fs = require('fs').promises;
const bodyparser = require('body-parser');

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

//külastuse registreerimine
app.get('/regvisit', (req, res) => {
	res.render('regvisit', {regMessage: ' '});
});

app.post('/regvisit', async (req, res) => {
	console.log(req.body);
	try{
		const date = dateTimeET.dateET(0);
		const time = dateTimeET.timeET();
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ',' + date + ',' + time + ';');
		res.render('regvisit', {regMessage: 'Salvestamine õnnestus!'});
	} catch{
		console.log(err);
		res.render('regvisit', {regMessage: 'Salvestamine ebaõnnestus...'});
	}
});

//viimane külastaja
app.get('/lastvisit', async (req, res) => {
	try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';');
		const lastVisit = visits[visits.length - 2];
        const visitData = lastVisit.split(',');
		const userName = visitData[0];
		const userDate = visitData[1];
		const userTime = visitData[2];
		res.render('lastvisit', {userName: userName, userDate: userDate, userTime: userTime});
    } catch (err) {
        console.log(err);
    }
});

app.listen(5313);
