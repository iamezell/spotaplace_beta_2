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
            for(prop in ratingObj){
                console.log(ratingObj[prop].vendorId);
                store.find({_id:ratingObj[prop].vendorId}, function(err, theStore){
                    console.log("below is what we are looking for")
                    console.log(theStore)
                })
            }
            req.session.POR = 'user';
		    res.render('members', { title: 'Members Area', ratings:ratingObj });
        })
		 
	}
  
};

exports.about =  function(req, res){
		res.render('about', { title: 'About US' });
}


exports.contact =  function(req, res){
		res.render('about', { title: 'About US' });
}