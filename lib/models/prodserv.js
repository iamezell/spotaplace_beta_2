// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
		name: String,
        description: String,
        product :[{description:String, price : Number, imagePath : String}],
        service :[{description:String, price : Number, imagePath : String}],
        imagePath : String,
        imageName : String,
        defaultPrice: Number,
        vendorId  : String,
        userId : String
})

exports.getModel = function(){
	return mongoose.model('prodserv', schema, 'prodserv');
}