var productModel = require('../models/productType');
var serviceModel = require('../models/servicestypes');
var vendorModel = require('../models/store');
var mongoose = require('mongoose');
var products = productModel.getProductType();
var service = serviceModel.getServiceType();
var vendor = vendorModel.getModel();
//mongoose.connect('mongodb://localhost/spotaplacedb');
//
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback () {
//  // yay!
//  console.log('yes!!');
//
//});




exports.index = function(req, res){
	res.render('vendor', { title: 'Welcome to Becoming a vendor' });
}

exports.getProductTypes = function(req, res){
	products.find({},function(err, product){
		if(err){
			res.send(err);
			console.log(err+"");
		}
		res.json(product);

	})
}

exports.getServiceType = function(req, res){
	service.find({}, function(err, services){
		if(err){
			res.send(err);
			console.log(err+"");
		}
		res.json(services);
			
	})
}

exports.putInfo = function(req, res){
	var vendorName = req.body['vendor-name'];
	var sellType = req.body['optionsRadios'];
	var sellSubType = req.body['medium-select'];
	var street = req.body['street'];
	var city = req.body['city'];
	var state = req.body['state'];
	var zip = req.body['zip'];
	var vendorEmail = req.body['email'];
	var vendorPhone = req.body['phone'];
	// var userId = req.session.userId;
	var userId2 = mongoose.Types.ObjectId(req.session.userId);
	// for now users can ony have one business so lets check for the business
	vendor.find({userId :userId2 }, function(err, ven){
		// if this is truthy then there is already a vendor for this account
		console.log('ven is..')
		console.log(ven);
		if(ven.length == 0){

			// insert the data
		vendor.create({name: vendorName,
    	email : vendorEmail,
    	phone : vendorPhone,
        addressStreet: street,
    	addressCity : city,
    	addressState : state,
    	addressZip : zip,
        userId : userId2}, function(err, vendor){
        	
        })
        res.json({"message" : "Thank you for becomming a vendor"});
		}else{
			res.json({"message" : "There is already a vendor attached"});
		}
	})


}






