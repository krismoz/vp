const mysql = require('mysql2/promise');

//@desc Photogallery
//@route GET /gallery
//@access private

const galleryPage = async (req, res) => {
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		const [galleryPhotos] = await connection.execute('SELECT id, filename, alttext FROM galleryphotos WHERE privacy >= 2 AND deleted IS NULL');
		res.render('gallery', {galleryPhotos, imagehref: process.env.GALLERY_THUMBNAIL});
	} catch (err){
		console.log('Tekkis viga: ', err);
		res.render('gallery', {galleryPhotos: [], imagehref: process.env.GALLERY_THUMBNAIL});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}

};

module.exports = {
	galleryPage
}