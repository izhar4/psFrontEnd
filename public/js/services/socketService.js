angular.module('pureSpectrumApp')
.factory('socket', ['$rootScope', 'config', function ($rootScope, config) {
  var socket_url = config.pureSpecturm.url;
  var socket = io.connect(socket_url,{forceNew: true,'reconnection': true,'reconnectionDelay': 1000,'reconnectionDelayMax': 5000,
      transports: ['websocket']
  });

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
