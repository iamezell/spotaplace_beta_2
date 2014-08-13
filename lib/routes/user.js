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

//mongoose.connect('mongodb://localhost/spotaplacedb');
//
//
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback () {
//  // yay!
//  console.log('yes!!');
//
//});

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
	// console.log(verificationNumber);
	//now lets check the database for this key
	User.findOne({'verificationNum' : verificationNumber}, function(err, user){
		if(!user){
			res.send(err)
			// console.log("User is falsy"+err)
		}
		user.verified = true;
		user.save();
		//user is verified lets redirect to homepage
		// console.log(user)
		res.redirect('/');
	})
}

exports.signin = function(req, res) {
    var email = req.body.user['email'];
    var password = req.body.user['password'];
    // console.log("here");
    //we need to find the account by the email

    

    User.findOne({'email':email}, function(err, Person){
    	// console.log("in here")
    	if(!Person){
    		console.log("nobody by that name");
    		res.json({'message' : 'your username or password does not match anything in this database'} ); 
    		return;
    	}
    	//we need to take the password and hash it with the salt that is stored in the user database
    	//hash the password along with the new salt
    	// console.log("Person")
 				bcrypt.hash(password, Person.salt, function(err, hash){
 					if(hash === Person.password){
 						// console.log("they match!");
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
 						// console.log("they DON'T match!")
 						res.json({'message' : 'your username or password does not match anything in this database'} );

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
 					// console.log("the password is "+userModel.password);
 					userModel.save();
 				} )

 				//we saved the model to the db now we will send an email to verify
 				// send mail with defined transport object
	 				var mailOptions = {
					    from: "Spotaplace <ezell@spotaplace.com>", // sender address
					    to: email, // list of receivers
					    subject: "Spotaplace email Verification Required", // Subject line
					    text: "Thank you for registering with us, you are now apart of the difference,", // plaintext body
					    html: '<b>Thank you for registering with us, you are now apart of the difference </b><p>http://spotaplace.com:3000/verify?'+mailId+'<p/>' // html body
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
					    if(error){
					        // console.log(error);
					    }else{
					        // console.log("Message sent: " + response.message);
					    }

		    			// if you don't want to use this transport object anymore, uncomment following line
	    				smtpTransport.close(); // shut down the connection pool, no more messages
					});
 			})
 			
 			 
 			 // res.send('Thank you for registering');
 			 res.json({'message' : 'Thank you for registering' });

 			
 			
 		}else{

 		// console.log('someone is already registered');
 		// res.send('Someone is already registered');
 		res.json({'message' : 'Someone is already registered' });
 		// res.redirect('/')
 	}
 		
 	})

}//end register

// contact us logic

exports.contactus = function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.message;
	var ourEmail = "info@thebigneed.com";
	
	var mailOptions = {
					    from: "The Big Need <info@thebigneed.com>", // sender address
					    to: ourEmail, // list of receivers
					    subject: "Contact from "+name, // Subject line
					    text: "We have a new message from "+name+". message: "+message, // plaintext body
					    html: '<p>We have a new message from '+name+'message:</p><br><p>'+message+'</p>' // html body
					}
	
	smtpTransport.sendMail(mailOptions, function(error, response){
					    if(error){
					         res.json({"error":error});
								res.json(error);
					    }else{
					        res.json({"message":"Message sent: " + response.message});
					    }
		// if you don't want to use this transport object anymore, uncomment following line
		smtpTransport.close(); // shut down the connection pool, no more messages
					});
}