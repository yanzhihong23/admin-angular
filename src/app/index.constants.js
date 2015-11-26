(function() {
  'use strict';

  angular
    .module('adminAngular')
    .constant('moment', moment)
    .constant('HOST', 'http://172.10.131.189:8090')
    // .constant('HOST', 'http://b2b.zaijiadd.com')
    .factory('APISERVER', function($location, HOST) {
      var host = /zaijiadd.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;

      return host + '/cobra';
    });

})();
