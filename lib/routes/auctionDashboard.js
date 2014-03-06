var Model = require('../models/auctions');
var mongoose = require('mongoose');
var auction = Model.getModel();
var global = require('../global.js');



exports.index = function(req, res){

	var userId =  req.session.userId;
	req.session.POR = 'user';

	
	auction.find({'userId':userId}, function(err, auction){
	 res.render('auctionDashboard', { title: 'Auction Dashboard', 'auctions' : auction  });
	})
	
	
}

