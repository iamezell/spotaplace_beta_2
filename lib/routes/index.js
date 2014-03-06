
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Spotaplace Beta' });
  // console.log(req.session)
};