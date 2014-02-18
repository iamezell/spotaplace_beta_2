var fs = require('fs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var path = require('path');
var serviceModel = require('../models/servicestypes');
var productModel = require('../models/productType');
var products = productModel.getProductType();
var service = serviceModel.getServiceType();

var prodserv = require('../models/prodserv');
var productModel = require('../models/productType');
var serviceModel = require('../models/servicestypes');
var storeModel = require('../models/store');
var userModel = require('../models/user');

var md5sum = crypto.createHash('md5');
var prodservModel = prodserv.getModel();
var prodservObj = {};
var store = storeModel.getModel();
var myDirPath = "/Users/ezellburke/Documents/spotaplaceBeta5/public/images/";


mongoose.connect('mongodb://localhost/spotaplacedb');




var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');

});


exports.index = function(req, res){
	//when we first hit the page we should search the database for the user id and find the pictures
	console.log(req.query.store);
	
	var vendorId = req.query.store;
	store.findOne({_id:vendorId}, function(err, store){
		
		prodservModel.find({userId:store.userId}, function(err, object){
			res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store});
		})
	})

	// prodservModel.find({userId:userId}, function(err, object){
	// 	console.log("fired");
	// 	// console.log(object);
	// 	store.findOne({userId:userId}, function(err, myStore){
	// 		// console.log(myStore.name);
	// 		// console.log(object);
	// 		res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":myStore});
	// 	})
		
	// })	

}







exports.forInfo = function(req, res){
	var vendorId = req.body.vendorId;
	store.findOne({_id:vendorId}, function(err, store){
		prodservModel.find({userId:store.userId}, function(err, object){
			res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store});
		})
	})
	console.log(vendorId);
}

