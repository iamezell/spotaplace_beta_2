var fs = require('fs');
var crypto = require('crypto');
var mongoose = require('mongoose');
var path = require('path');
var serviceModel = require('../models/servicestypes');
var productModel = require('../models/productType');
var products = productModel.getProductType();
var service = serviceModel.getServiceType();
var nodemailer = require('nodemailer');

var prodserv = require('../models/prodserv');
var productModel = require('../models/productType');
var serviceModel = require('../models/servicestypes');
var storeModel = require('../models/store');
var userModel = require('../models/user');
var ratingsModel = require('../models/rating');

var md5sum = crypto.createHash('md5');
var prodservModel = prodserv.getModel();
var prodservObj = {};
var store = storeModel.getModel();
var myDirPath = "/Users/ezellburke/Documents/spotaplace_beta_2/public/images/";
// var myDirPath = "/var/lib/jenkins/jobs/spotaplace\ general\ build/workspace/public/images/";
var Model = require('../models/auctions'); 
var auction = Model.getModel();
var ratings = ratingsModel.getModel();



//mongoose.connect('mongodb://localhost/spotaplacedb');




//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback () {
//  // yay!
//  console.log('yes!!');
//
//});


exports.index = function(req, res){
	//when we first hit the page we should search the database for the user id and find the pictures
	
	//this is assuming that the we are a vendor and we are trying to look at our own stuff
	var vendorId = req.query.store;
	var auctionId = req.query.auctionId;
//	console.log(req.session.userId);
//	console.log("above this is the userId");
	if (req.query.win){
		//go through and 
		//1 delete the auction
		auction.findOne({_id:auctionId}, function(err, doc){
//		 console.log(doc);
		doc.remove();
		});
		
        //give user the ability to rate by putting an empty rating in the system
//        ratings.push({vendorId:vendorId, userId:req.session.userId,})
        
        var userRating = new ratings({vendorId:vendorId, userId:req.session.userId, rated:true});
        //save rating
        userRating.save();
        
        
		
		store.findOne({_id:vendorId}, function(err, store){

			prodservModel.find({userId:store.userId}, function(err, object){

				ratings.find({vendorId:vendorId}, function(err, rating){

					res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store, "win":true });
			
				})
				
			})
		})
		

	}else{

		store.findOne({_id:vendorId}, function(err, store){
			// console.log(store);
			prodservModel.find({userId:store.userId}, function(err, object){
				ratings.find({vendorId:store.userId}, function(err, rating){
				res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store, "win":false });
			})
			})
		})


	}

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

