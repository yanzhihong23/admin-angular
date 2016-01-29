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

    this.storeFilterData = {
      status: storeStatusList,
      itemsPerPage: itemsPerPage,
      provinceList: AddressService.provinces,
      storeStatus: {
        '1': '正常',
        '-1': '休假中',
        '-2': '退店'
      },
      sourceType: {
        '-1': '全部',
        '1': '经销商',
        '2': '销售'
      }
    };

    this.financeFilterData = {
      status: {
        '-1': '全部',
        '2': '已打款',
        '0': '未打款'
      },
      type: {
        '-1': '全部',
        '0': '开店奖励',
        '1': '推广奖励'
      },
      itemsPerPage: itemsPerPage
    }

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
        storeStatus: '1',
        sourceType: '-1',
        provinceId: '全部',
        itemsPerPage: '10',
        currentPage: 1,
        totalItems: 0,
        searchStr: '',
        orgId: '-1',
        memberId: '-1',
        startDate: moment('2015-07-01'),
        endDate: moment()
      };

      this.financeFilter = {
        type: '-1',
        status: '-1',
        itemsPerPage: '10',
        searchStr: ''
      }
    };

    this.reset();

    $log.debug('FilterService end');
    
  }
})();
