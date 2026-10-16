const express = require('express');
const router = express.Router();

//kasutatavd kontrollerid
const {
	etMovies,
	etMoviePeople,
	etMoviePeopleExtra,
	etMoviePeopleExtraPost,
	etMovieExtra,
	etMovieExtraPost,
	etMovieJobExtra,
	etMovieJobExtraPost,
	etMoviePeopleConnections,
	etExtraMoviePeopleConnections,
	etExtraMoviePeopleConnectionsPost
} = require('../controllers/etMovieControllers');

router.route('/').get(etMovies);

router.route('/movie_people').get(etMoviePeople);

router.route('/extra_movie_people').get(etMoviePeopleExtra);

router.route('/extra_movie_people').post(etMoviePeopleExtraPost);

router.route('/extra_etmovies').get(etMovieExtra);

router.route('/extra_etmovies').post(etMovieExtraPost);

router.route('/extra_etmovie_jobs').get(etMovieJobExtra);

router.route('/extra_etmovie_jobs').post(etMovieJobExtraPost);

router.route('/movie_people_connections').get(etMoviePeopleConnections);

router.route('/extra_movie_people_connections').get(etExtraMoviePeopleConnections);

router.route('/extra_movie_people_connections').post(etExtraMoviePeopleConnectionsPost);

module.exports = router;