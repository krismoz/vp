const fs = require('fs').promises;
const path = require('path');
const regTextRef = path.join(__dirname, '../public/txt/visits.txt');
const dateTimeET = require('../src/dateTimeET.js');



const visits = async (req, res) => {
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
		res.render('visits', {userName: null, userDate: null, userTime: null});
    }
};

const regVisit = (req, res) =>{
	res.render('regvisit', {regMessage: null});
};

const regVisitPost = async (req, res) => {
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
};

module.exports = {
	visits,
	regVisit,
	regVisitPost
}