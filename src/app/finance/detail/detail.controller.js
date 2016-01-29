(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('FinanceDetailController', FinanceDetailController);

  /** @ngInject */
  function FinanceDetailController($log, $state, $scope, $stateParams, $location, UserService, FinanceApi, SystemApi, CallApi, StatusService, AddressService, toastr, moment) {
    var vm  = this, 
        id = $stateParams.id,
        user = UserService.getUser();

    init();

    function init() {
      getDetail();
    }

    function getDetail() {
      FinanceApi.detail({userId: user.uId, id: id}).success(function(data) {
        if(data.flag === 1) {
          var info = angular.copy(data.data);

          vm.shop = {
            id: info.appStoreId,
            openDate: moment(info.openTime).format('YYYY-MM-DD'),
            owner: info.shopkeeperName,
            name: info.shopName,
            username: info.shopId,
            addr: info.shopAddr,
            payTime: info.payMoneyTime && moment(info.payMoneyTime).format('YYYY-MM-DD')
          };

          vm.refund = {
            initialFee: info.receivable,
            initialFeePaid: info.realityMoney,
            type: info.awardType ? '推广奖励' : '开店奖励',
            reward: info.roleAwardMoney,
            dealer: info.agencyName,
            bank: {
              name: info.bankname,
              branch: info.bankSubbranch,
              cardNo: info.bankNum
            },
            updateTime: info.awardRoleOperation && moment(info.awardRoleOperation.createdDate).format('YYYY-MM-DD HH:mm:ss'),
            payer: info.awardRoleOperation && info.awardRoleOperation.userName
          };
        } else {
          toastr.error(data.msg);
        }
      });
    }

  }
})();
