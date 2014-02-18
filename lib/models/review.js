// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
	whoPosted : String,
	whoReviewed : String,
	reviewText : String,
	rating : Number

})

exports.getServiceType = function(){
	return mongoose.model('services', schema, 'services');
}