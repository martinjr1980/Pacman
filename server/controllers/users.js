var mongoose = require('mongoose')
module.exports = {
 index: function(req, res){
  res.render('users/index', {title:'Welcome Page'});
 }
}