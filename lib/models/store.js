// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');


var schema = new mongoose.Schema({
	name: String,
    	email : String,
    	phone : String,
        addressStreet: String,
    	addressCity : String,
    	addressState : String,
        addressProvince : String,
    	addressZip : String,
        verified : Boolean,
        vendorType : String,
        vendorSubType :String,
        website: String,
        product :  {type:String},
        auctions : [{}],
        userId : { type: [String], index: true }
})

exports.getModel = function(){
	return mongoose.model('store', schema, 'store');
}