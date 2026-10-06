const fs = require('fs').promises;
const path = require('path');


const folkWisdomET = function(rawText){
	let folkWisdom = rawText.split(';');
	let wisdomNum = Math.round(Math.random() * (folkWisdom.length - 1));
	return folkWisdom[wisdomNum];
}

async function readTextFile() {
    try {
        const wisdomPath = path.join(__dirname, '..', 'txt', '/vanasonad.txt');
        const data = await fs.readFile(wisdomPath, 'utf8');
        return folkWisdomET(data);
    } catch (err) {
        console.log('Viga: ' + err);
    }
}

module.exports = {folkWisdomET: readTextFile};