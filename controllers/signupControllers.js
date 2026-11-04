const mysql = require('mysql2/promise');
const validator = require('validator');
const argon = require('argon2');

//@desc page for creating user account
//@route GET /signup
//@access public
const signupPage = (req, res) => {
	res.render('signup', {notice: 'Ootan andmeid!'});
};

//@desc page for creating user account
//@route POST /signup
//@access public
const signupPagePost = async (req, res) =>{
	let connection;
	let notice = '';
	//puhastame andmeid ja valideerime
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;
	//kontrollime, kas kõik on olemas
	if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword){
		notice = 'Andmeid on puudu!';
		return res.render('signup', {notice: notice});
	}
	
/* 	//eesnime kontrolli
	if(!validator.isAlpha(firstName, 'et-EE') || firstName.length < 2){
		notice = 'Eesnimi pole korrektne!';
		return res.render('signup', {notice: notice});
	}
	
	//perekonnanime kontroll
	if(!validator.isAlpha(lastName, 'et-EE') || lastName.length < 2){
		notice = 'Perekonnanimi pole korrektne!';
		return res.render('signup', {notice: notice});
	} */
	
	//kas e-mail on korrektne
	if(!validator.isEmail(email)){
		notice = 'E-maili aadress pole korrektne!';
		return res.render('signup', {notice: notice});
	}
	
	//kas parool on piisavalt tugev
	const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0} //minSymbols: 1 nõuaks vähemalt 1 erilist tähemärki nagu nt ! , $ jne.
	if(!validator.isStrongPassword(password, passwordOptions)){
		notice = 'Salasõna pole piisavalt tugev!';
		return res.render('signup', {notice: notice});
	}
	
	//kas sisestatud paroolid klapivad/ühtivad
	if(password !== confirmPassword){
		notice = 'Sisestatud salasõnad pole ühesugused!';
		return res.render('signup', {notice: notice});
	}
	
	//kas sünnikuupäev on korrektne
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)){
		notice = 'Sisestaud sünnikuupäev ei ole korrektne!';
		return res.render('signup', {notice: notice});
	}
	try{
		connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_DATABASE
		});
		//kas äkki on selline juba olemas
		const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
		if(users.length > 0){
			notice = 'Selline kasutaja on juba olemas!'
			return res.render('signup', {notice: notice});
		}
		//kui pole olemas, siis salvestame
		
		//krüpteerin parooli
		const pwdHash = await argon.hash(password);
		const [result] = await connection.execute(
		'INSERT INTO users (firstname, lastname, birthdate, gender, email, password) VALUES (?,?,?,?,?,?)',
		[firstName, lastName, birthDate, gender, email, pwdHash]);
		
		notice = 'Loodi kasutajakonto: ' + result.insertId;
		res.render('signup', {notice: notice});
	} catch (err){
		console.log('Tekkis viga:', err);
		res.render('signup', {notice: 'Kasutajakonto loomine ebaõnnestus'});
	}
	finally {
		if(connection){
			await connection.end();
		}
	}
}

module.exports = {
	signupPage,
	signupPagePost
}
