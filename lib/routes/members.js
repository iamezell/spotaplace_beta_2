var ratingsModel = require('../models/rating');
var ratings = ratingsModel.getModel();
var storeModel = require('../models/store');
var store = storeModel.getModel();

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
//	
	ratings.find({userId:userId}, function(err, ratingObj){
//            console.log("we have some ratings and there are"+ ratingObj);
            //now that we have the ratings we need to look into the vendor database and get vendor info at least vendor name and id
			// we can change this to an array
		if(ratingObj.length !== 0){
		var ratingsArray = [];
			
            for(var n = 0; n < ratingObj.length; n++){
                
				var count = ratingObj.length;
				var i=0;
                console.log(n)
                store.find({_id:ratingObj[n].vendorId}, function(err, theStore){
//                    total_processed = total_processed - 1;
                    console.log("below is what we are looking for");
                    i++;
					console.log("the i variable is"+i)
                    ratingsArray.push(theStore);
                    console.log("this number is "+n);
                    if(i == ratingObj.length){
//                        req.session.POR = 'user';
//                        res.render('members', { title: 'Members Area', ratings:ratingsArray });
//						var jsonRatings = JSON.stringify(ratingsArray);
//						console.log(jsonRatings);
						res.send(ratingsArray);
							
                    }
					
                })
            }
		}else{
			res.json({"message":"none"})
		
		}
           
        })
	
//	ratings.find({userId:userId}, function(err, ratingObj){
//		 var array1 = []; 
//		for(var i = 0; i < ratingObj.length; i++){
//			
//			 array1.push(ratingObj[i].vendorId);
//		 }
//		console.log(array1.length);
//	var promise = store.find({_id : {$in: array1}}).exec();
//		promise.then(function(arrayofVendors){
//				res.send(arrayofVendors);
//		})
//		
//	});
}


exports.about =  function(req, res){
		res.render('about', { title: 'About US' });
}


exports.contact =  function(req, res){
		res.render('about', { title: 'About US' });
}