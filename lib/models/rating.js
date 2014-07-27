// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	vendorId : String,
	userId : String,
	ratingText : String,
	ratingNumber: Number,
	rated:Boolean
})


exports.getModel = function(){
	return mongoose.model('ratings', schema, 'ratings');
}