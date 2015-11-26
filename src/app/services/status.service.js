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

          map[-1] = '全部';
          list.unshift('-1');

          localStorageService.set('statusMap', map);
          localStorageService.set('statusList', list);
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
