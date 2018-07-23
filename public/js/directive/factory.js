/**
 * Created by Parveen on 5/4/2016.
 */

angular.module('pureSpectrumApp')

.factory('encodeDecodeFactory', function() {
  return {
    encode: function(data) {
      return encodeURIComponent(JSON.stringify(data));
    },
    decode: function(searchString) {
      return JSON.parse(decodeURIComponent(searchString));
    }
  };
});