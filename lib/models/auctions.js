// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');
var bidSchema = new mongoose.Schema({
	vendorId : String,
	description : String,
	vendorName : String,
	price: Number
})

var schema = new mongoose.Schema({
        description: String,
        rate : Number,
        userId  : String,
        type : String,
        vendorsAttached : [{userId:String}], 
        activated : Boolean,
        bids : [bidSchema]
})

exports.getModel = function(){
	return mongoose.model('auctions', schema, 'auctions');
}