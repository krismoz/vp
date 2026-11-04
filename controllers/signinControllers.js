const mysql = require('mysql2/promise');
const validator = require('validator');
const argon = require('argon2');

//@desc page for logging in
//@route GET /signin
//@access public
const signinPage = (req, res) => {
	res.render('signin', {notice: 'Ootan konto andmeid!'});
};

//@desc page for logging in
//@route POST /signin
//@access public
const signinPagePost = async (req, res) =>{
	let connection;
	let notice = '';
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	//kontrollime, kas kõik on olemas
	if(!email || !password){
		notice = 'Andmeid on puudu!';
		return res.render('signin', {notice: notice});
	}
	
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//kas selline on olemas
		const [users] = await connection.execute('SELECT id, password FROM users WHERE email = ?', [email]);
		//kui pole
		if(users.length === 0){
			notice = 'Kasutajatunnus ja/või salasõna on vale!';
			return res.render('signin', {notice: notice});
		}
		//kontrollib andmebaasist saadud krüpteeritud parooli parooliga mis sisselogimises sisestati
		const match = await argon.verify(users[0].password, password);
		if(match){
			console.log('Oled sisseloginud kasutaja ' + users[0].id);
			return res.redirect('/home');
		} else{
			notice = 'Kasutajatunnus ja/või salasõna on vale!';
			return res.render('signin', {notice: notice});
		}
	} catch (err){
		console.log('Tekkis viga:', err);
		res.render('signin', {notice: 'Sisselogimine ebaõnnestus!'});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}

module.exports = {
	signinPage,
	signinPagePost
}
