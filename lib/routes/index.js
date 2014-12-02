
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('commingSoon', { title: 'The Big Need Beta' });
  // console.log(req.session)
};