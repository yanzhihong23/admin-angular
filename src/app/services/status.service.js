(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('StatusService', StatusService);

  /** @ngInject */
  function StatusService(localStorageService, $log, $state, $rootScope, ApiService) {
    var map = localStorageService.get('statusMap'),
        list = localStorageService.get('statusList');

    if(!map) {
      map = {};
      ApiService.getStatusList().success(function(data) {
        if(data.flag === 1) {
          list = data.data.statusTypeList.map(function(obj) {
            map[obj.statusValue] = obj.statusName;
            return obj.statusValue;
          });

          localStorageService.add('statusMap', map);
          localStorageService.add('statusList', list);

          $log.debug(list);
        }
      });
    }

    this.getStatusMap = function() {
      return map;
    };

    this.getStatusList = function() {
      return list;
    };

    $log.debug('StatusService end');
    
  }
})();
