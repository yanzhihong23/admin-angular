/* global moment:true */
(function() {
  'use strict';

  angular
    .module('adminAngular')
    .constant('moment', moment)
    // .constant('HOST', 'http://172.10.130.142:8080')
    .constant('HOST', 'http://b2b-test.zaijiadd.com:81')
    .factory('APISERVER', function($location, HOST) {
      var host = /zaijiadd.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;

      return host + '/cobra';
    });

})();
