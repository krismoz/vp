//function dateFormattedET(){
	
//kuupäev
const dateFormattedET = function(opt){
	let timeNow = new Date();
	let	monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	if(opt == 1){
		monthNamesET = ['näärikuu','küünlakuu','paastukuu','jürikuu','lehekuu','jaanikuu','heinakuu','lõikuskuu','mihklikuu','viinakuu','talvekuu','jõulukuu'];
	}
	return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
}

//kellaaeg
const timeFormattedET = function(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	if(hourNow < 10){
		hourNow = '0' + hourNow;
	}
	let minuteNow = timeNow.getMinutes();
	if(minuteNow < 10){
		minuteNow = '0' + minuteNow;
	}
	let secondNow = timeNow.getSeconds();
	if(secondNow < 10){
		secondNow = '0' + secondNow;
	}
	return hourNow + ':' + minuteNow + ':' + secondNow;
}

const whatDayET = function(){
	let whichDay = new Date().getDay();
	const dayNamesET = ['pühapäev','esmaspäev','teisipäev','kolmapäev','neljapäev','reede','laupäev'];
	return dayNamesET[whichDay];
}
//tuleb nimi anda (dateET = nimi)
module.exports = {dateET: dateFormattedET, timeET: timeFormattedET, dayET: whatDayET};