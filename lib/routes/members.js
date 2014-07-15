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
        
        ratings.find({userId:userId}, function(err, ratingObj){
//            console.log("we have some ratings and there are"+ ratingObj);
            //now that we have the ratings we need to look into the vendor database and get vendor info at least vendor name and id
			// we can change this to an array
            for(var i = 0; i < ratingObj.length; i++){
                var ratingsArray = []
				var count = ratingObj.length;
                
                store.find({_id:ratingObj[i].vendorId}, function(err, theStore){
//                    total_processed = total_processed - 1;
                    console.log("below is what we are looking for");
                    
                    ratingsArray.push(theStore);
                    
                    if(i == ratingObj.length){
                        req.session.POR = 'user';
                        res.render('members', { title: 'Members Area', ratings:ratingsArray });
                    }
                })
            }
           
        })
		 
	}
  
};

exports.about =  function(req, res){
		res.render('about', { title: 'About US' });
}


exports.contact =  function(req, res){
		res.render('about', { title: 'About US' });
}