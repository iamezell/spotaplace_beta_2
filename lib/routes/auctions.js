var ObjectId = require('mongoose').Types.ObjectId;
var global = require('../global.js');
var Model = require('../models/auctions');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');
var md5sum = crypto.createHash('md5');
var auction = Model.getModel();
var vendor = require('../models/store');
var nodemailer = require('nodemailer');
var storeModel = require('../models/store');
var store = storeModel.getModel();

var that = this;

function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

var key = makeid();

var mailId = crypto.createHash('md5').update(key).digest("hex");


// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "iamezell@gmail.com",
		pass: "sgyyydgwuoucatjw"
	}
});





exports.index = function(req, res){


	var auctionId = req.body['auction'];
	var POR = req.session.POR;
	

	if(POR == 'vendor'){
		var vendor_Id = req.session.vendorId;

		console.log('in vendor search');
		console.log(auctionId);
		
		auction.findOne({_id:auctionId}, function(err , theAuction){


			res.render('auctions', { title: 'Spotaplace Beta', 'auction':theAuction, "vendorId": vendor_Id });
		})

	}else{
			auction.findOne({_id:auctionId}, function(err , theAuction){
				console.log(auctionId)
				if(theAuction){
					res.render('auctions', { title: 'Spotaplace Beta', 'auction':theAuction, "vendorId": null });
				}
				
			})
		}



	//now we have the auction id we can instantiate it
	// log the auction
	// set the timer
	
}




global.io.on('connection', function(socket){ 
	console.log('connection is made');
	// that.addBid();
	socket.on('bid', function(data){

		console.log(data);
		var auctionID = data.auctionId;
		var match = false;
		var matchVendor = false;
		var vendorID = data.vendorId;
		var description = data.description;
		console.log(vendorID);
		auction.findOne({_id:auctionID}, function(err, auctionObj){
			store.findOne({_id:vendorID}, function(err, store){
				console.log(store);
				 //check if there are any auctions
				 if(!store.auctions){
				 	store.auctions.push(auctionObj);
				 	store.save();
				 }
				 for (var i = 0; i < store.auctions.length; i++) {
				 	if(store.auctions[i]._id == auctionID){
				 		match = true;
				 	}
				 };

				 if(!match){
				 	store.auctions.push(auctionObj);
				 	store.save();
				 }

				 var storeName = store.name;
				 auctionObj.bids.push({vendorId: vendorID, description:description, vendorName:storeName});
				 auctionObj.save();
				 
				 console.log('this should be saved');
				 //ok now we need to send back
				 socket.emit('bidBoxReturn', {'auctionID':auctionID, 'vendorID':vendorID,'description':description })
				 
				});
			
		})
	})

});

// exports.addBid = function(req, res, obj){
// 	// console.log('the request body')
// 	// console.log(req.body)
// 	var auctionID = req.body.auctionId;
// 	var vendorID = req.body.vendorId;
// 	var description = req.body.description;

// // 	auction.findOne({_id:auctionID}, function(err, auctionObj){
// // 		// auctionObj.bids.push({vendorId: vendorID, description:description, vendorName:storeName});
// // 		// console.log(auctionObj.bids);

// // 		store.findOne({_id:vendorID}, function(err, store){
// // 			var storeName = store.name;
// // 			auctionObj.bids.push({vendorId: vendorID, description:description, vendorName:storeName});
// // 			auctionObj.save();
// // 			res.json({'auctionID':auctionID, 'vendorID':vendorID, 'description':description, vendorName: storeName });
// // 			// we also have to send the bid to everyone elses machine
// // 			// console.log(global.io);
// // 			// global.io.on('connection', function (socket) {
// // 			// 	console.log("connected");
// //   	// 			socket.emit('bid', {'auctionID':auctionID, 'vendorID':vendorID, 'description':description, vendorName: storeName });
// //  		// 		console.log('recieved');
// // 			// });
// // 		})
// // 		global.io.sockets.on('connection', function(){ 
// //  	console.log("connected");
// // });
// // 	});

// }

exports.makeAuction = function(req, res){
	var description = req.body.description;
	var type = req.body['medium-select'];
	var city= req.body.city;
	var state = req.body.state;
	var userId = req.session.userId;
	var rate = req.body.rate;
	// console.log(req.body);

	var auctionModel = new auction({'description':description, 'type': type, 'city': city, 'state':state, 'rate':rate, 'userId':userId, 'activated':true});

	auction.find({userId:userId}, function(err, auction){
		// each user can have up to 10 live auctions
		// so we need to count only live auctions
		var numLive = 0;
		for (var i = 0; i < auction.length; i++) {
			if(auction.activated === true){
				//iterate the value of numLive
				numLive++;

			}
		};
		//forgot the better way to do this
		if(auction.length == 0 || numLive < 10){
			
			auctionModel.save();
			//now we have to send the emails out to all the vendors in the list
			//we saved the model to the db now we will send an email to verify
 				// send mail with defined transport object

					// now lets look for the vendors and add this as a possible auction for them
					store.find({vendorType:auction.type}, function(err, vendor){
						// console.log(vendor);
						for( var i = 0; i < vendor.length; i++){
					  	// console.log("hi")

					  }

					})


					res.redirect('/auction-dashboard');
				}else{
					console.log("too many auctions");
					res.redirect('/auction-dashboard');
				}

			})


}

exports.enterAuction = function(req, res){
	
	
	var auctionId = req.body['auction'];
	var POR = req.session.POR;
	var match = false;

	console.log(req.body)
	if(POR == 'vendor'){
		var vendor_Id = req.session.vendorId;

		console.log('in vendor search');
		// now lets fo into the structure to find the auction
		//lets store the id into ourmodel
		// store.findOne({_id:vendor_Id}, function(err, store){
		// 	//we just want to check if we have not yet stored this id
		// 	for (var i = 0; i < store.auctions.length; i++) {
		// 		if(store.auctions[i] === auctionId){
		// 		 	match = true;
		// 		}
		// 	};
		// 	if(!match){
		// 		store.auctions.push(auctionId);
		// 		store.save();
		// 	}

		// })
		// auction.findOne({_id:auctionId}, function(err , theAuction){
		// 	if(!theAuction){
			
		// 		//finally foud out to do this !!!!!
		// 		store.update({ _id:new ObjectId(req.session.vendorId) },
		//       	{ $pull: { auctions : { _id : new ObjectId(auctionId) } } },
		//      	false,
		//      	function(err,obj, raw){
		//      		console.log(raw);

		//      	}); 


		// 	}else{
		// 		console.log("we are rendering");
		// 		req.session.theAuction = theAuction;
		// 		req.session.vendorId = vendor_Id;
		// 		res.redirect('/auctions');

		// 	 	//res.render('auctions', { title: 'Spotaplace Beta', 'auction':theAuction, "vendorId": vendor_Id });
		// 	}
			
		// })

	// }else{
	// 		auction.findOne({_id:auctionId}, function(err , theAuction){
	// 			console.log(auctionId)
	// 			if(theAuction){
	// 				// res.render('auctions', { title: 'Spotaplace Beta', 'auction':theAuction, "vendorId": null });
	// 				req.session.theAuction = theAuction;
	// 				req.session.vendorId = null;
	// 				res.redirect('/auctions');

	// 			}
				
	// 		})
		}
	

	
}

exports.getAuctions = function(req,res){
	// res.send('ok');
	var storeID = req.body.storeId;
	// console.log(storeID);
	store.findOne({_id: storeID}, function(err, store){
		// console.log(store.vendorSubType);
		auction.find({type:store.vendorSubType}, function(err, auction){
			// console.log(auction);
			// now that we have the auction array lets send it back to the client
			res.json({'auctions':auction});
		})
	})
	// console.log(req.body)
}
