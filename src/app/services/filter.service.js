(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('FilterService', FilterService);

  /** @ngInject */
  function FilterService($log, StatusService, AddressService) {
    var statusList = StatusService.getStatusList(),
        storeStatusList = StatusService.getStoreStatusList(),
        itemsPerPage = [10, 15, 20, 25, 30];

    this.filterData = { // -1 for all, and fix empty option
      status: statusList,
      coType: ['-1', '1', '2'],
      itemsPerPage: itemsPerPage
    };

    this.reset = function() {
      this.filter = {
        status: '-1', // all
        coType: '-1', // all
        itemsPerPage: '10',
        currentPage: 1,
        totalItems: 0,
        searchStr: '',
        orgId: '-1',
        memberId: '-1'
      };

      this.storeFilter = {
        status: '-1', // all
        provinceId: '-1',
        itemsPerPage: '10',
        currentPage: 1,
        totalItems: 0,
        searchStr: '',
        orgId: '-1',
        memberId: '-1',
        startDate: moment('2015-07-01'),
        endDate: moment()
      };
    };

    this.storeFilterData = {
      status: storeStatusList,
      itemsPerPage: itemsPerPage,
      provinceList: AddressService.provinces
    };

    this.reset();

    $log.debug('FilterService end');
    
  }
})();
