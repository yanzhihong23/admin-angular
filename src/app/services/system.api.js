(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('SystemApi', SystemApi);

  /** @ngInject */
  function SystemApi($http, $log, APISERVER) {
    var headers = {'Conetent-Type': 'application/json'};

    this.channelList = function() {
      return $http({
        method: 'POST',
        url: APISERVER + '/system/channelInfo'
      });
    };

    this.provinceList = function() {
      return $http({
        method: 'GET',
        url: 'assets/data/province.json'
      });
    };

    this.cityList = function() {
      return $http({
        method: 'GET',
        url: 'assets/data/city.json'
      });
    };

    $log.debug('SystemApi end');
    
  }
})();
