
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('commingSoon', { title: 'Spotaplace Beta' });
  // console.log(req.session)
};