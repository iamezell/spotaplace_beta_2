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