exports.members = function(req, res){
	if(!req.session.isLogged){
		res.redirect('/');
	}else{
		//redirect to homepage
		
		
		req.session.POR = 'user';
		res.render('members', { title: 'Members Area' });
		console.log(req.session)
	}
  
};

