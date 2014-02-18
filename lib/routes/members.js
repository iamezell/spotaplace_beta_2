exports.members = function(req, res){
	if(!req.session.isLogged){
		res.redirect('/');
	}else{
		//redirect to homepage
		
		console.log(req.session)
		res.render('members', { title: 'Members Area' });
	}
  
};

