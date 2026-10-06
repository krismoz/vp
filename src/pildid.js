const fs = require('fs').promises;
const path = require('path');

const randomPicture = async function(){
	const jpgPicture = await readPictureFiles();
	let pictureNum = Math.round(Math.random() * (jpgPicture.length - 1));
	return jpgPicture[pictureNum];
}

async function readPictureFiles() {
    try {
        const picturePath = path.join(__dirname, '..', 'public', 'pic');
        const data = await fs.readdir(picturePath);
        return data.filter(file => file.toLowerCase().endsWith('.jpg'));
    } catch (err) {
        console.log('Viga: ' + err);
    }
}

module.exports = {randomJpgPicture : randomPicture, allJpgPictures : readPictureFiles};