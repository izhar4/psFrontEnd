/**
 * Created on 25-06-2014.
 * Router managing routes to index and login for Pure Spectrum
 */

var indexController = require('./../controllers/index');

module.exports.set = function(appObj){
      appObj.get('/',indexController.index);
}


