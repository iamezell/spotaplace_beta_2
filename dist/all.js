var Global = {
    io : { }
};    
module.exports = Global;
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
// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
	name: String
})

exports.getServiceType = function(){
	return mongoose.model('services', schema, 'services');
}
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
// we need to make a schema for our user so that our user data will ahve structure
// require our mongoose library
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/spotaplacedb');

var schema = new mongoose.Schema({
	name: String,
    	email : String,
    	password : String,
    	salt : String,
        addressStreet: String,
    	addressCity : String,
    	addressState : String,
        addressProvince : String,
    	addressZip : String,
        session :  String,
        verificationNum : String,
        verified : Boolean,
        isVendor : Boolean
})

exports.getModel = function(){
	return mongoose.model('user', schema);
}
exports.user = function(req, res){
	
}
var Model = require('../models/auctions');
var mongoose = require('mongoose');
var auction = Model.getModel();


exports.index = function(req, res){
	var userId =  req.session.userId;
	req.session.POR = 'user';

	
	auction.find({'userId':userId}, function(err, auction){
	 res.render('auctionDashboard', { title: 'Auction Dashboard', 'auctions' : auction  });
	})
	
}


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


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Spotaplace Beta' });
  console.log(req.session)
};
exports.members = function(req, res){
	if(!req.session.isLogged){
		res.redirect('/');
	}else{
		//redirect to homepage
		
		
		req.session.POR = 'user';
		res.render('members', { title: 'Members Area' });
		console.log(req.session)
	}
  
};


var mongoose = require('mongoose');
var Model = require('../models/user');
// var ObjectId = mongoose.Schema.Types.ObjectId;
var User = Model.getModel();

mongoose.connect('mongodb://localhost/spotaplacedb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');
  

});


exports.settings = function(req, res){
	if(!req.session.isLogged){
		res.redirect('/');
	}else{
		//redirect to homepage
		console.log(req.session);
		res.render('settings', { title: 'Settings' });
	}
	console.log(res);

  
};

exports.saveLocationSettings = function(req, res){
    var streetAddress = req.body.user['address'];
    var city = req.body.user['city'];
    var state = req.body.user['state'];
    var province = req.body.user['province'];
    var postalCode = req.body.user['postalCode'];
    console.log(req.session.userId);
    var id = mongoose.Types.ObjectId(req.session.userId);
    User.findOne({_id :id}, function(err, consumer){
    	if(err){
    		res.send(err)

    	}
    	 consumer.addressStreet = streetAddress;
    	consumer.addressCity = city;
    	consumer.addressState = state;
        consumer.addressProvince = province;
    	consumer.addressZip = postalCode;
    	res.json(consumer)
    })
    

}
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
var auctionModel = require('../models/auctions');
var auctions = auctionModel.getModel();
var ObjectId = require('mongoose').Types.ObjectId;


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






function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var key = makeid();

// var imageId = crypto.createHash('md5').update(key).digest("hex");





exports.index = function(req, res){
	//when we first hit the page we should search the database for the user id and find the pictures
	var userId = req.session.userId;
	//hold the auctions in here
	var myAuctions = [];
	// hold the aucitons inthis variable should be an array of aucitons
	console.log("on my way")
	

	req.session.POR = 'vendor';
	store.findOne({userId:userId}, function(err, myStore){
			if(!myStore){
				console.log("no body home");
				res.render('store', { title: 'Welcome to the shop' , "message":"You have no store yet, change your future"});
			}else{

				//lets also get the auctions that the vendor is in
				// console.log(myStore.name);
				//just make sure that the session variable gets the vendorId
				req.session.vendorId = myStore._id;
				//now that we have the store lets get the auctions that it belongs to 
				// we need to go through the auctions array and make sure they exsist
				var auctionsArray = myStore.auctions;
				console.log(auctionsArray.length);
				//now lets loop through all the auctions and do the darn thing
				for (var i = 0; i < auctionsArray.length; i++) {
					//now we need to get the auction id from here
					var id = auctionsArray[i]._id;
					console.log('this is the id');
					console.log(id.toString())
					//search auctions to make sure it exists
					auctions.findOne({_id:id}, function(err, theAuction){
						if(!theAuction){
							//remove auction
							console.log("finally foud out to do this !!!!!");
							store.update({ _id:myStore._id },
					      	{ $pull: { auctions : { _id : new ObjectId(id.toString()) } } },
					     	false,
					     	function(err,obj, raw){
					     		console.log(raw);

					     	});
					     	myStore.save();
						}else{
							console.log(theAuction);
						}

					})

				};

				// console.log('THIS IS THE LENGTH OF THE ARRAY'+ myAuctions.length);
				
			res.render('store', { title: 'Welcome to the shop' , "hello" : {}, "store":myStore, "message":null, 'vendorsAuction': myStore.auctions});
			}
		})

	//do a find  on the auction model
	// prodservModel.find({userId:userId}, function(err, object){
	// 	console.log("fired");
	// 	// console.log(object);
		
		
	// })

}

exports.addProductServ = function(req, res){
	//lets get info from the  add product form
	var name = req.body['prod-serv-name'];
	var description = req.body['description'];
	var price = req.body['price'];

	prodservObj.name = name;
	prodservObj.description = description;
	prodservObj.price = price;
	


	//we need to place in the db
	
	// console.log(req.body)
	res.json({message : "hello"})

}

exports.addProductServImage = function(req, res){
	
fs.readFile(req.files.photoImage.path, function (err, data) {
	// var publicPath = path.join(__dirname+"/public");
	// var imageId = crypto.createHash('md5').update(key).digest("hex");
	var imageId = crypto.randomBytes(20).toString('hex');
   	var dirPath = myDirPath+imageId+".jpg";
   	console.log("this is the iamge id is")
   	console.log(imageId);

   	prodservObj.imagePath = "/images/"+imageId+".jpg";
   	prodservObj.imageName = imageId;


   
  fs.writeFile(dirPath, data, function (err) {
  	console.log(imageId);
    
    if(err){
    	console.log(err);
    }
    var medium = {};
     var medium = new prodservModel({name: prodservObj.name, description:prodservObj.description, defaultPrice: prodservObj.price, imagePath : prodservObj.imagePath, imageName : prodservObj.imageName,userId : req.session.userId })
    
    console.log(medium);

  
    medium.save();
   res.redirect("back");

   });
});


}

exports.removeProduct = function(req, res){
	console.log("hello");
	console.log(req.params.id);

	var prodservId = req.params.id;
	prodservModel.findOne({_id: prodservId}, function(err, ps){
		
		ps.remove();
		res.send('ok');
	})



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
	var storeName = req.body['store-name'];
	var sellType = req.body['optionsRadios'];
	var sellSubType = req.body['medium-select'];
	var street = req.body['street'];
	var city = req.body['city'];
	var state = req.body['state'];
	var zip = req.body['zip'];
	var storeEmail = req.body['email'];
	var storePhone = req.body['phone'];
	// var userId = req.session.userId;
	var userId2 = mongoose.Types.ObjectId(req.session.userId);
	// for now users can ony have one business so lets check for the business
	store.find({userId :userId2 }, function(err, ven){
		// if this is truthy then there is already a vendor for this account
		
		
		if(ven.length == 0){

			// insert the data
		store.create({name: storeName,
    	email : storeEmail,
    	phone : storePhone,
        addressStreet: street,
    	addressCity : city,
    	addressState : state,
    	addressZip : zip,
    	vendorSubType : sellSubType,
    	vendorType : sellType,
        userId : userId2}, function(err, store){
        	
        })
        res.json({"message" : "Thank you for becomming a vendor"});
		}else{
			res.json({"message" : "There is already a vendor attached"});
		}
	})
	//now we have to find the user and set the vendorflag to true
	var user = userModel.getModel();
	user.find({_id: userId2}, function(err, user){
		if(err){
			res.send(err);
		}
		
		user.isVendor = true;
	})


}




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
var Model = require('../models/auctions'); 
var auction = Model.getModel();


mongoose.connect('mongodb://localhost/spotaplacedb');




var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');

});


exports.index = function(req, res){
	//when we first hit the page we should search the database for the user id and find the pictures
	
	
	var vendorId = req.session.vendorId;
	var auctionId = req.query.auctionId;
	if (req.query.win){
		//go through and 
		//1 delete the auction
		auction.findOne({_id:auctionId}, function(err, doc){
		// console.log(doc);
		doc.remove();
		});
		// find all users and delete the auctions from them

		// send email to all receipiants
		store.findOne({_id:vendorId}, function(err, store){

			prodservModel.find({userId:store.userId}, function(err, object){
				res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store, "win":true });
			})
		})
		

	}else{

		store.findOne({_id:vendorId}, function(err, store){

			prodservModel.find({userId:store.userId}, function(err, object){
				res.render('storeFront', { title: 'Welcome to the shop' , "hello" : object, "store":store, "win":false });
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


var Model = require('../models/user');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var SALT_WORK_FACTOR = 10;
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var md5sum = crypto.createHash('md5');
var User = Model.getModel();
var storeModel = require('../models/store');
var store = storeModel.getModel();

mongoose.connect('mongodb://localhost/spotaplacedb');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');

});

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

// setup e-mail data with unicode symbols

exports.verify = function(req, res){
	var verificationNumber = req._parsedUrl.query;
	console.log(verificationNumber);
	//now lets check the database for this key
	User.findOne({'verificationNum' : verificationNumber}, function(err, user){
		if(!user){
			res.send(err)
			console.log("User is falsy"+err)
		}
		user.verified = true;
		user.save();
		//user is verified lets redirect to homepage
		console.log(user)
		res.redirect('/');
	})
}

exports.signin = function(req, res) {
    var email = req.body.user['email'];
    var password = req.body.user['password'];
    console.log("here");
    //we need to find the account by the email

    

    User.findOne({'email':email}, function(err, Person){
    	console.log("in here")
    	if(!Person){
    		console.log("nobody by that name");
    		res.send("nobody by that name");
    		return;
    	}
    	//we need to take the password and hash it with the salt that is stored in the user database
    	//hash the password along with the new salt
    	console.log("Person")
 				bcrypt.hash(password, Person.salt, function(err, hash){
 					if(hash === Person.password){
 						console.log("they match!");
 						//later we will decide what info we will store in the session
 						// res.send('they match');
 						req.session.isLogged = true;
 						req.session.userId = Person.id; 
 						//now that we have userid lets see if this user is a vendor
 						store.findOne({userId:Person.id}, function(err, store){
 								if(store){
 								req.session.vendorId = store._id;
 								
 							}
 							res.redirect('/members');
 						})
 						
 						//start session
 						//console.log(req.session);

 					}else{
 						console.log("they DON'T match!")
 					}
 					
 				} )



    })
    

};

exports.logout = function(req, res){
	// req.session.isLogged = false;
	req.session.isLogged = false;
	req.session.userId = null;
	req.session.vendorId = null;

	res.redirect('/');
}


exports.register = function(req, res){
	// res.send('it works from here!!')
	
	var name = req.body.user['name'];
	var email = req.body.user['email'];
	var password = req.body.user['password'];
	var myTest = new User({});
	var key = Math.random();
	// console.log(Person.findOne({}));
	// console.log(User.findOne({}));
	// res.send("ok");
	var userModel = new User({'email':email, 'name':name, 'password': password});

	//ok lets check that there is not the same email already in the system denoting that the user is already registered
	User.findOne({'email' : email }, function(err, user){
		res.send('done')
 		if(!user){
 			bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
 				if(err){
 					res.send(err);
 				}

 				//hash the password along with the new salt
 				bcrypt.hash(userModel.password, salt, function(err, hash){
 					userModel.password = hash;
 					userModel.salt = salt;
 					userModel.verificationNum = mailId;
 					console.log("the password is "+userModel.password);
 					userModel.save();
 				} )

 				//we saved the model to the db now we will send an email to verify
 				// send mail with defined transport object
	 				var mailOptions = {
					    from: "Spotaplace <ezell@spotaplace.com>", // sender address
					    to: email, // list of receivers
					    subject: "Spotaplace email Verification Required", // Subject line
					    text: "Thank you for registering with us, you are now apart of the difference,", // plaintext body
					    html: '<b>Thank you for registering with us, you are now apart of the difference </b><p>http://localhost:3000/verify?'+mailId+'<p/>' // html body
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
				    if(error){
				        console.log(error);
				    }else{
				        console.log("Message sent: " + response.message);
				    }

	    			// if you don't want to use this transport object anymore, uncomment following line
	    			smtpTransport.close(); // shut down the connection pool, no more messages
			});
 			})
 			
 			 
 			 res.send('Thank you for registering');

 			
 			
 		}else{

 		console.log('someone is already registered');
 		res.send('Someone is already registered');
 	}
 		
 	})





}
var productModel = require('../models/productType');
var serviceModel = require('../models/servicestypes');
var vendorModel = require('../models/store');
var mongoose = require('mongoose');
var products = productModel.getProductType();
var service = serviceModel.getServiceType();
var vendor = vendorModel.getModel();
mongoose.connect('mongodb://localhost/spotaplacedb');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');

});

console.log(products);


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






