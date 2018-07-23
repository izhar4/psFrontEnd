/**
 * Index controller
 *
 */

var url = require('url');
exports.index = function(req, res, next) {
    console.log("Fetching Index html cont" +  __dirname+'./../public');
    res.sendFile('index.html', {root: __dirname+'./../public'});
};

/*// controller function to add customer and return a token
exports.login = function(req, res , next){
    res.sendfile('login.html', {root: __dirname+'../../public'});
};
*/