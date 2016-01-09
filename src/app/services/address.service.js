(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('AddressService', AddressService);

  /** @ngInject */
  function AddressService($log, SystemApi) {
    var vm = this;

    vm.provinceList = [];
    vm.provinces = [{id: '-1', name: '全部'}];

    // local
    SystemApi.provinceList().success(function(data) {
      data.forEach(function(obj) {
        var p = {
          id: obj.provinceId,
          name: obj.provinceName
        }

        vm.provinceList.push(p);
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

    SystemApi.province().success(function(data) {
      if(data.flag === 1) {
        data.data.privinceList.forEach(function(obj) {
          var p = {
            id: obj.provinceId,
            name: obj.provinceName
          }

          vm.provinces.push(p);
        })
      }
    });

    $log.debug('AddressService end');
    
  }
})();
