const express = require('express');
const router = express.Router();

const {
	visits,
	regVisit,
	regVisitPost
} = require('../controllers/visitControllers');

router.route('/').get(visits);

router.route('/regvisit').get(regVisit);

router.route('/regvisit').post(regVisitPost);

module.exports = router;