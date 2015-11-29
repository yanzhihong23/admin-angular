(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('AddressService', AddressService);

  /** @ngInject */
  function AddressService($log, SystemApi) {
    var vm = this;

    SystemApi.provinceList().success(function(data) {
      vm.provinceList = data.map(function(obj) {
        return {
          id: obj.provinceId,
          name: obj.provinceName
        };
      });
    });

    SystemApi.cityList().success(function(data) {
      vm.cityList = data.map(function(obj) {
        return {
          name: obj.cityName,
          id: obj.cityId + '',
          provinceId: obj.provinceId
        };
      });
    });

    $log.debug('AddressService end');
    
  }
})();
