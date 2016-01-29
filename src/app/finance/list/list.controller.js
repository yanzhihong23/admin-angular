(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('FinanceListController', FinanceListController);

  /** @ngInject */
  function FinanceListController($log, $state, $scope, FinanceApi, UserService, FilterService, toastr, moment, $uibModal) {
    var vm = this, user = UserService.getUser();

    vm.user = user;
    vm.filterData = FilterService.financeFilterData;
    vm.filter = FilterService.financeFilter;

    // methods
    vm.detail = detail;
    vm.update = update;
    vm.pageChanged = updateDataList;
    vm.search = search;

    init();

    // init
    function init() {
      updateDataList();
      filterWatcher();
    }

    // filter watcher
    function filterWatcher() {
      $scope.$watch(function() {
        return vm.filter;
      }, function(val, old) {
        switch(true) {
          case val.type !== old.type:
          case val.status !== old.status:
          case val.itemsPerPage !== old.itemsPerPage:
            updateDataList();
            break;
        }
      }, true);
    }

    function search(evt) {
      if(evt.keyCode === 13) { // enter
        updateDataList();
      }
    }

    function updateDataList() {
      var searchFilter = angular.copy(vm.filter);
      searchFilter.userId = user.uId;

      FinanceApi.list(searchFilter).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.filter.totalItems = data.data.dataCount;

          vm.list = data.data.applayAwardList.map(function(obj) {
            return {
              id: obj.applayAwardId,
              storeId: obj.appStoreId,
              openDate: obj.openTime&&moment(obj.openTime).format('YYYY-MM-DD'),
              returnDate: obj.createdDate&&moment(obj.createdDate).format('YYYY-MM-DD'),
              type: obj.awardType ? '推广奖励' : '开店奖励',
              dealer: obj.agencyName,
              amount: obj.roleAwardMoney,
              bankName: obj.bankname,
              bankNo: obj.bankNum,
              state: obj.applyState // 2: 已返款
            };
          })
        } else {
          vm.filter.totalItems = 0;
        }
      })
    }

    function detail(id) {
      $state.go('finance.detail', {id: id});
    }

    function update(id) {
      $uibModal.open({
        animation: true,
        templateUrl: 'app/finance/list/confirm.modal.html',
        controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
          $scope.cancel = function() {
            $uibModalInstance.dismiss('success');
          };

          $scope.submit = function() {
            $uibModalInstance.dismiss('success');
            FinanceApi.update({id: id, amount: $scope.amount, userId: user.uId}).success(function(data) {
              if(data.flag === 1) {
                toastr.success('成功标记为已打款');
                updateDataList();
              } else {
                toastr.error(data.msg);
              }
            });

            $log.debug(id, +$scope.amount);
          };
        }],
        size: 'sm'
      })
    }
 
  }
})();
