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

exports.about =  function(req, res){
		res.render('about', { title: 'About US' });
}


exports.contact =  function(req, res){
		res.render('about', { title: 'About US' });
}
