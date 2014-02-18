// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
	name: String
})

exports.getProductType = function(){
	return mongoose.model('medium', schema, 'medium');
}