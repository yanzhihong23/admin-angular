(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('FinanceApi', FinanceApi);

  /** @ngInject */
  function FinanceApi($http, $log, APISERVER) {
    var headers = {'Conetent-Type': 'application/json'};

    this.list = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/applayAward/getRoleApproveList',
        header: headers,
        data: {
          userId: obj.userId,
          awardType: obj.type == -1 ? null : +obj.type,
          roleApproveState: obj.status == -1 ? null : +obj.status,
          searchCondition: obj.searchStr,
          page: obj.currentPage || 1, // 当前页码
          pageCount: +obj.itemsPerPage  || 10 // 每页条数
        }
      });
    };

    this.detail = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/applayAward/getPcApplayAwardDet',
        header: headers,
        data: {
          userId: obj.userId,
          applayAwardId: +obj.id
        }
      });
    };

    
    this.update = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/applayAward/approveAward',
        header: headers,
        data: {
          applayAwardId: obj.id,
          userId: obj.userId, 
          roleApproveState: 2,
          roleAwardMoney: +obj.amount
        }
      });
    };

    $log.debug('FinanceApi end');
  }
})();
