var ratingsModel = require('../models/rating');
var ratings = ratingsModel.getModel();
var storeModel = require('../models/store');
var store = storeModel.getModel();
var userModel = require('../models/user');
var user = userModel.getModel();
var newsLetters = require('../models/newsletter');
var newsLetter = newsLetters.getModel();

exports.members = function(req, res){
	if(!req.session.isLogged){
		res.redirect('/');
	}else{
        var userId = req.session.userId;
		//redirect to homepage
		//ok we want to check if the user has any reviews
        
        
		 req.session.POR = 'user';
                        res.render('members', { title: 'Members Area'});
		 
	}
  
};

exports.getMemberData = function(req, res){
	var userId = req.session.userId;
	var count = 0;
	var resArray = [];
	var numRatings = 0;
	
	
	function findStore(storeObject){
		//console.log("this is the store object");
		//console.log(storeObject.ratingsId);
		
			store.find({_id:storeObject.vendorId}, function(err, theStore ){
                 	
					storeObject.store = theStore;
					resArray.push(storeObject);
					count++;
					if(count === numRatings){
//						console.log("There are "+numRatings+" ratings in the array.")
						res.send(resArray);
					}
					
                })
		
	}
		

	ratings.find({userId:userId, rated:true}, function(err, ratingObj){
//            //console.log("we have some ratings and there are"+ ratingObj);
            //now that we have the ratings we need to look into the vendor database and get vendor info at least vendor name and id
			// we can change this to an array
		if(ratingObj.length !== 0){
		
			// we need to build an object and push as one of he properties the the rating id
//		 var sendObj = { "ratingsId":""};
			
			function sendObj(){
				this.ratingsId = "";
			}
			
			numRatings = ratingObj.length;
			
            for(var n = 0; n < ratingObj.length; n++){
                var resObject = new sendObj();
				resObject.ratingsId = ratingObj[n]._id;
				resObject.vendorId = ratingObj[n].vendorId;
				
				findStore(resObject);
            }
		}else{
			res.json({"message":"none"})
		
		}
           
        })
	
//	ratings.find({userId:userId}, function(err, ratingObj){
//		 var array1 = []; 
//		for(var i = 0; i < ratingObj.lengt; i++){
//			
//			 array1.push(ratingObj[i].vendorId);
//		 }
//		//console.log(array1.length);
//	var promise = store.find({_id : {$in: array1}}).exec();
//		promise.then(function(arrayofVendors){
//				res.send(arrayofVendors);
//		})
//		
//	});
}

exports.saveEmails = function(req, res){
	var email = req.body.email;
	var letter = new newsLetter({'email':email});
	
	letter.save();
	
	
}


exports.postReview = function(req, res){
	////console.log("we have some reviews");
	//so get user id 
	var user_id = req.session.userId;
	var rating_id = req.body['ratings-Id'];
	var rating_text = req.body['ratingText'];
	console.log(req.body);
	
//	ratings.find({_id:rating_id}, function(err, ratingObj){
//		
//		console.log(ratingObj);
//	});
	ratings.findByIdAndUpdate(rating_id,{ratingText:rating_text, rated:false
	
	},{}, function(err, rating){
		res.send(rating._id);
		console.log(rating._id);
		
	})
}

exports.getReviews = function(req, res){
	
	console.log("in get reviews");
	vendor_id = req.body['vendor_id'];
	var iterate = 0;
	var numRatings = 0;
	var sendArray = [];
	
	function Rating(){
		this.name = "";
		this.ratingText = "";
		
	}
	
	function getUserNametemp(user_id,ratingText, ratingNumber){
		user.findOne({_id:user_id}, function(err, userObj){
				
				var myRating = new Rating();
				myRating.name = userObj.name;
				myRating.ratingText = ratingText;
				sendArray.push(myRating);
				iterate++
				//put into closure
//				getStoretemp(storeObj[i].name);
				console.log("iterate is "+iterate);
				console.log("numratings is"+ numRatings);
				if(iterate == numRatings){
					res.send(sendArray);
				}
				
			
		})
	}
	
	//go into reviews database nd 
		ratings.find({"vendorId":vendor_id}, function(err, ratingObj){
		//build a response
			numRatings = ratingObj.length;
			for(var i=0; i < ratingObj.length; i++){
//				console.log(ratingObj[i])
				//put into closure
				getUserNametemp(ratingObj[i].userId,ratingObj[i].ratingText,ratingObj[i].number );
				//push other info into array
				
				
			}
		
	});
}


exports.about =  function(req, res){
		res.render('about', { title: 'About US' });
}


exports.contact =  function(req, res){
		res.render('about', { title: 'About US' });
}