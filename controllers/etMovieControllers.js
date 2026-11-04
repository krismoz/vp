const mysql = require('mysql2/promise');

//@desc home page for Estonian Movie section
//@route GET /etmovies
//@access public
const etMovies = (req, res) => {
	res.render('etmovies');
};

//@desc page for people involved in Estonian Movie industry
//@route GET /etmovies/movie_people
//@access public
const etMoviePeople = async (req, res) => {
	let connection; 
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		//käivitame päringu
		const [sqlRes] = await connection.execute(sqlReq);
		console.log(sqlRes);
		res.render('movie_people', {personList: sqlRes});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('movie_people', {personList: []});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

//@desc page for adding people involved in Estonian Movie industry
//@route GET /etmovies/extra_movie_people
//@access public
const etMoviePeopleExtra = (req, res) => {
	res.render('extra_movie_people', {notice: 'Ootan sisestust!', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
};

//@desc page for adding people involved in Estonian Movie industry
//@route POST /etmovies/extra_movie_people
//@access public
const etMoviePeopleExtraPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, teeme kõige lahjema kontrolli
	let deceasedDate = null;
	let deceasedDateTime = null;
	if(req.body.deceasedInput != ''){
		deceasedDate = req.body.deceasedInput;
		deceasedDateTime = new Date(deceasedDate);
	}
	
	//sünnikuupäeva võrdlemine
	const bornDate = new Date(req.body.bornInput);
	const timeNow = new Date();
	
	//Eesnime kontroll
	if(!req.body.firstNameInput){
		console.log('Eesnimi puudub!');
		return res.render('extra_movie_people', {notice: 'Eesnimi puudub!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Perekonnanime kontroll
	if(!req.body.lastNameInput){
		console.log('Perekonnanimi puudub!');
		return res.render('extra_movie_people', {notice: 'Perekonnanimi puudub!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Sünnikuupäeva kontroll
	if(!req.body.bornInput || isNaN(bornDate.getTime()) || bornDate > timeNow){
		console.log('Sünnikuupäev ei ole korrektne!');
		return res.render('extra_movie_people', {notice: 'Sünnikuupäev ei ole korrektne!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	//Surmakuupäeva kontroll
	// Kõik kontrollid on pandud sulgudes sisse selleks, et kui esimene kontroll on false ehk surmakuupäev on jäetud tühjaks siis && jätab kõik ülejäänud kontrollid vahele sest see teab, et ülejäänud ei saa ka true olla. Muidu tuleb getTime() error. ChatGPT aitas.
	// Kui on sisestatud surmakuupäev siis "deceasedDate != null" on true ja ta hakkab ülejäänut ka kontrollima.
	if(deceasedDate != null && (isNaN(deceasedDateTime.getTime()) || deceasedDateTime > timeNow || deceasedDateTime < bornDate)){
		console.log('Surmakuupäev ei ole korrektne!');
		return res.render('extra_movie_people', {notice: 'Surmakuupäev ei ole korrektne!', wrongFirstName: req.body.firstNameInput, wrongLastName: req.body.lastNameInput, wrongBornInput: req.body.bornInput, wrongDeceasedInput: deceasedDate});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)';
		await connection.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('extra_movie_people', {notice: req.body.firstNameInput + ' ' + req.body.lastNameInput + ' andmebaasi salvestatud.', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_movie_people', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongFirstName: null, wrongLastName: null, wrongBornInput: null, wrongDeceasedInput: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

//@desc page for adding Estonian Movies
//@route GET /etmovies/extra_etmovies
//@access public
const etMovieExtra = (req, res) => {
	res.render('extra_etmovies', {notice:'Ootan sisestust!', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
};

//@desc page for adding Estonian Movies
//@route POST /etmovies/extra_etmovies
//@access public
const etMovieExtraPost = async (req, res) => {
	console.log(req.body);
	if(!req.body.filmTitle){
		console.log('Filmi pealkiri puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi pealkiri puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmYear){
		console.log('Filmi väljastamise aasta puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi väljastmise aasta puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmDurationMinutes){
		console.log('Filmi kestvus minutites puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi kestvus minutites puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	else if(!req.body.filmDescription){
		console.log('Filmi kirjeldus puudub!');
		return res.render('extra_etmovies', {notice: 'Filmi kirjeldus puudub!', wrongFilmTitle: req.body.filmTitle, wrongFilmYear: req.body.filmYear, wrongFilmDurationMinutes: req.body.filmDurationMinutes, wrongFilmDescription: req.body.filmDescription});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?,?,?,?)';
		await connection.execute(sqlReq, [
			req.body.filmTitle,
			req.body.filmYear,
			req.body.filmDurationMinutes,
			req.body.filmDescription
		]);
		res.render('extra_etmovies', {notice: req.body.filmTitle + ' andmebaasi salvestatud.', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_etmovies', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongFilmTitle: null, wrongFilmYear: null, wrongFilmDurationMinutes: null, wrongFilmDescription: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

//@desc page for adding jobs involved in Estonian Movie industry
//@route GET /etmovies/extra_etmovie_jobs
//@access public
const etMovieJobExtra = (req, res) => {
	res.render('extra_etmovie_jobs', {notice:'Ootan sisestust!', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
};

//@desc page for adding jobs involved in Estonian Movie industry
//@route POST /etmovies/extra_etmovie_jobs
//@access public
const etMovieJobExtraPost = async (req, res) => {
	console.log(req.body);
	if(!req.body.movieJobTitle){
		console.log('Ameti nimetus puudub!');
		return res.render('extra_etmovie_jobs', {notice: 'Ameti nimetus puudub!', wrongMovieJobTitle: req.body.movieJobTitle, wrongMovieJobDescription: req.body.movieJobDescription});
	}
	else if(!req.body.movieJobDescription){
		console.log('Ameti kirjeldus puudub!');
		return res.render('extra_etmovie_jobs', {notice: 'Ameti kirjeldus puudub!', wrongMovieJobTitle: req.body.movieJobTitle, wrongMovieJobDescription: req.body.movieJobDescription});
	}
	let connection;
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		let sqlReq = 'INSERT INTO profession (title, description) VALUES (?,?)';
		await connection.execute(sqlReq, [
			req.body.movieJobTitle,
			req.body.movieJobDescription
		]);
		res.render('extra_etmovie_jobs', {notice: 'Amet: "' + req.body.movieJobTitle + '" andmebaasi salvestatud.', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
	} catch(err){
		console.log('Andmebaasiga suhtlemise viga: ' + err);
		res.render('extra_etmovie_jobs', {notice: 'Tekkis viga, andmeid ei salvestatud.', wrongMovieJobTitle: null, wrongMovieJobDescription: null});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

//@desc page for showing people involved in Estonian films and their connections
//@route GET /etmovies/movie_people_connections
//@access public
const etMoviePeopleConnections = async (req, res) => {
	let connection;
	try{
		connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE
		});
		const [personConnectionList] = await connection.execute(
			'SELECT person.first_name, person.last_name, movie.title AS movie_title, profession.title AS profession_title, person_in_movie.character_name FROM person_in_movie JOIN person ON person_in_movie.person_id = person.id JOIN movie ON person_in_movie.movie_id = movie.id JOIN profession ON person_in_movie.profession_id = profession.id'
		);
		res.render('movie_people_connections', {personConnectionList});
	} catch (err){
		console.log('Tekkis viga: ', err);
		res.render('movie_people_connections', {personConnectionList: []});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

//@desc page for adding connections (In what movie actor stars etc)
//@route GET /etmovies/extra_movie_people_connections
//@access public
const etExtraMoviePeopleConnections = async (req, res) => {
	let connection;
	try{
		connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE
		});
		/* let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await connection.execute(sqlReq);
		console.log(sqlRes); */
		const [personList] = await connection.execute('SELECT * FROM person ORDER BY last_name, first_name');
		
		const [movieList] = await connection.execute('SELECT * FROM movie ORDER BY title');
		
		const [professionList] = await connection.execute('SELECT * FROM profession ORDER BY title');
		res.render('extra_movie_people_connections', {notice: '', personList, movieList, professionList});
	} catch (err) {
		console.log('Tekkis viga: ', err);
		res.render('extra_movie_people_connections', {notice: 'Tekkis viga!',personList: [], movieList: [], professionList: []});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};
//@desc page for adding connections (In what movie actor stars etc)
//@route POST /etmovies/movie_people_connections
//@access public
const etExtraMoviePeopleConnectionsPost = async (req, res) => {
	let connection;
	try{
		connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_DATABASE
		});

        const [personList] = await connection.execute(
            'SELECT * FROM person ORDER BY last_name, first_name'
        );
        const [movieList] = await connection.execute(
            'SELECT * FROM movie ORDER BY title'
        );
        const [professionList] = await connection.execute(
            'SELECT * FROM profession ORDER BY title'
        );

		if(!req.body.personInput){
			return res.render('extra_movie_people_connections', {notice: 'Palun valige isik!', personList, movieList, professionList});
		}
		else if(!req.body.movieInput){
			return res.render('extra_movie_people_connections', {notice: 'Palun valige film!', personList, movieList, professionList});
		}
		else if(!req.body.professionInput){
			return res.render('extra_movie_people_connections', {notice: 'Palun valige amet!', personList, movieList, professionList});
		}
		if (req.body.professionInput == 1 && !req.body.characterInput?.trim()){
			return res.render('extra_movie_people_connections', {notice: 'Näitlejal peab olema ka tegelaskuju!', personList, movieList, professionList});
		}
		else if(req.body.professionInput != 1){
			req.body.characterInput = null;
		}
		const [existingConnectionCheck] = await connection.execute(
            'SELECT * FROM person_in_movie WHERE person_id = ? AND movie_id = ? AND profession_id = ? AND character_name <=> ?',
            [req.body.personInput, req.body.movieInput, req.body.professionInput, req.body.characterInput]
        );
		if(existingConnectionCheck.length > 0){
            return res.render('extra_movie_people_connections', {notice: 'Selline seos on juba olemas!', personList, movieList, professionList});
        }
		await connection.execute(
            'INSERT INTO person_in_movie (person_id, movie_id, profession_id, character_name) VALUES (?, ?, ?, ?)',
            [req.body.personInput, req.body.movieInput, req.body.professionInput, req.body.characterInput]
        );
		res.render('extra_movie_people_connections', {notice: 'Seos edukalt loodud.', personList, movieList, professionList});
	} catch (err) {
		console.log('Tekkis viga: ', err);
		res.render('extra_movie_people_connections', {notice: 'Tekkis viga.', personList, movieList, professionList});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
};

module.exports = {
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
}
