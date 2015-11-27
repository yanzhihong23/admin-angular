(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('FilterService', FilterService);

  /** @ngInject */
  function FilterService($log, StatusService) {
    var statusList = StatusService.getStatusList();

    this.filterData = { // -1 for all, and fix empty option
      status: statusList,
      coType: ['-1', '1', '2'],
      itemsPerPage: [10, 15, 20, 25, 30]
    };

    this.filter = {
      status: '-1', // all
      coType: '-1', // all
      itemsPerPage: '10',
      currentPage: 1,
      totalItems: 0,
      searchStr: ''
    };

    $log.debug('FilterService end');
    
  }
})();
