const express = require('express');
const multer = require('multer');

const router = express.Router();

//seadistame multer vahevara faile üles laadima kindlasse kataloogi
const upload = multer({dest: process.env.UPLOAD_ORIGINAL_PATH});
//saab määrata ka lubatud failitüüpe, failimahtu jms

//kasutatavd kontrollerid
const {
	galleryPhotoUpload,
	galleryPhotoUploadPost
} = require('../controllers/galleryPhotoUploadControllers');

router.route('/').get(galleryPhotoUpload);

router.route('/').post(upload.single('photoInput'), galleryPhotoUploadPost);

module.exports = router;