
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'The Big Need Beta' });
  // console.log(req.session)
};