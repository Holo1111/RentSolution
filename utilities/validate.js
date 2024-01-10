//this file has the validator package, which will validate any given input name,email,tel or address

let validator = require('validator');


//using the Promise resolve or reject to determine if the given name is valid or not, it will return the message
// we check the name by the isAlphanumeric method wtihin validator
let _validate_name = (name) => {
	return new Promise((resolve, reject) => {
		name = name.split(' ').join(''); //Removing blanks
		let is_valid = validator.isAlphanumeric(name);
		if (is_valid){
			resolve('The name is valid.');
		} else {
			reject('The name is invalid.');
		}
	});
};

//similarly for email, here we use isEmail to validate
let _validate_email = (email) => {
	return new Promise((resolve, reject) => {
		let is_valid = validator.isEmail(email);
		if (is_valid){
			resolve('The email is valid.');
		} else {
			reject('The email is invalid.');
		}
	});
};

//for phone we use isMobilePhone
let _validate_phone = (phone) => {
	return new Promise((resolve, reject) => {
		let is_valid = validator.isMobilePhone(phone);
		if (is_valid){
			resolve('The phone is valid.');
		} else {
			reject('The phone is invalid.');
		}
	});
};

// for address we simply take the input as address can have letters,numbers and characters
let _validate_address = (address) =>{
	return new Promise((resolve, reject) => {
		let is_valid = true;
		if (is_valid){
			resolve('The address is valid.');
		} else {
			reject('The address is invalid.');
		}
	});
};

//now since we want everything to be validated we use the method Promise.all to validate all
//this method will return true if everyhting was validated, if only 1 value is not valid it will return false
module.exports.validate_fields = (name, email, phone, address) => {
	return Promise.all([_validate_name(name), _validate_email(email), 
							_validate_phone(phone), _validate_address(address)])
		.then((values) => {
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

