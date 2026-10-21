const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const sharp = require('sharp');

//@desc page for uploading photos to gallery
//@route GET /galleryphotoupload
//@access public
const galleryPhotoUpload = (req, res) => {
	res.render('galleryphotoupload');
};

//@desc page for uploading photos to gallery
//@route POST /galleryphotoupload
//@access public
const galleryPhotoUploadPost = async (req, res) =>{
	//console.log(req.body)
	//console.log(req.file);
	let connection;
	try{
		//genereerime oma failinime
		const fileName = 'vp_' + Date.now() + '.jpg';
		await fs.rename(req.file.path, req.file.destination + fileName);
		//teeme väiksema veebisõbraliku pildi
		await sharp(req.file.destination + fileName).resize(800, 500).jpeg({quality: 90}).toFile('./public/gallery/normal/' + fileName);
		//teeme pisipildi (100x100)
		await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 90}).toFile('./public/gallery/thumbs/' + fileName);
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//const sqlReq = 'INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)'; Tegin vajaliku käsu all ise.
		const userId = 1; //See on ajutine, kuni teeme kasutajkontod ja sisselogimise
		const [result] = await connection.execute(
		'INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES (?,?,?,?,?)',
		[fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		res.render('galleryphotoupload');
	} catch (err){
		console.log('Tekkis viga:', err);
		res.render('galleryphotoupload');
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}

module.exports = {
	galleryPhotoUpload,
	galleryPhotoUploadPost
}
