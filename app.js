
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var http = require('http');
var server = http.createServer(app, function(){
	//console.log("Server Created");
});
var global = require('./lib/global.js');

// var app = require('express')();
// var server = require('http').Server(app);
// var io = require('socket.io').listen(server);
server.listen(80);

global.io = require('socket.io').listen(server);
global.io.set('log level', 4);


var MongoStore = require('connect-mongo')(express);
var routes = require('./lib/routes');
var members = require('./lib/routes/members');
var path = require('path');
var auctions= require('./lib/routes/auctions');
var vendor = require('./lib/routes/vendor');
var storeFront = require('./lib/routes/storeFront');
var auctionDashboard = require('./lib/routes/auctionDashboard');



var user = require('./lib/routes/user');
var settings = require('./lib/routes/settings');
var store = require('./lib/routes/store');
var api = require('./lib/routes/api');

// var app = express();

mongoose.connect('mongodb://localhost/spotaplacedb');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
  console.log('yes!!');

});

// all environments
app.use(express.bodyParser());
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'lib/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//make this more secure later
app.use(express.cookieParser('1234567890QWERTY'));
// app.use(express.session());
app.use(express.session({
  store: new MongoStore({
    db: 'spotaplacedb',
    host: '127.0.0.1',
    
  })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/members', members.members);
app.post('/regi', user.register);
app.post('/signin', user.signin)
app.get('/verify', user.verify);
app.get('/logout', user.logout)
app.get('/settings', settings.settings);
app.post('/location', settings.saveLocationSettings);
app.get('/productTypes', store.getProductTypes);
app.get('/servicetypes', store.getServiceType);
app.post('/vendorinfo', store.putInfo);
app.post('/auction', auctions.index);
app.post('/make-auction', auctions.makeAuction);
app.post('/enter-auction', auctions.enterAuction);
app.get('/auction-dashboard', auctionDashboard.index);
app.post('/getAuctions', auctions.getAuctions);
app.get('/getMemberData', members.getMemberData);
app.post('/reviews', members.postReview);
app.post('/getReviews', members.getReviews);
app.post('/interested', members.saveEmails);
app.post('/contactus', user.contactus);

app.get('/store', store.index);
app.post('/add-product-serv', store.addProductServ);
app.post('/add-product-serv-image', store.addProductServImage);
app.post('/remove-product/:id', store.removeProduct);
app.get('/store-front', storeFront.index);
app.post('/forInfo', storeFront.forInfo);
app.get('/about', members.about);
app.get('/contact', members.contact);
