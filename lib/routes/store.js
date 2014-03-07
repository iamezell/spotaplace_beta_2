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
 // var myDirPath = "/Users/ezellburke/Documents/spotaplace_beta_2/public/images/";
var myDirPath = "/var/lib/jenkins/jobs/spotaplace\ general\ build/workspace/public/images/";


mongoose.connect('mongodb://localhost/spotaplacedb');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  // console.log('yes!!');

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
				res.render('store', { title: 'Welcome to the shop' , "message":"You have no store yet, change your future", "store":null});
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



