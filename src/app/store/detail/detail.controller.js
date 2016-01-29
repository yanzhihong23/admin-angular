(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('StoreDetailController', StoreDetailController);

  /** @ngInject */
  function StoreDetailController($log, $state, $scope, $stateParams, $location, UserService, StoreApi, SystemApi, CallApi, StatusService, AddressService, toastr, moment) {
    var vm  = this, 
        id = $stateParams.id,
        user = UserService.getUser();

    vm.save = save;

    init();

    function init() {
      getDetail();
      getAssignHistory();
      getRemarkHistory();
    }


    function getDetail() {
      StoreApi.detail({id: id}).success(function(data) {
        if(data.flag === 1) {
          var info = angular.copy(data.data);

          info.shopDate = moment(info.shopDate).format('YYYY-MM-DD');
          info.idNo = info.personNum;
          info.wechat = info.weixin;
          info.addr = info.detailAddress;
          info.alipayAccount = info.payAlipayNum;
          info.saleman = info.merchantsName;
          info.warehouseAddr = info.warehouseAddress;
          info.sourceType = info.shopSourceType + '';
          info.storeStatus = info.storeStatus + '';
          info.threePlusOne = info.threePlusOne == null ? '' : info.threePlusOne + '';

          info.imgGood = info.imgGood == null ? '' : info.imgGood + '';
          info.sortingGood = info.sortingGood == null ? '' : info.sortingGood + '';

          info.remark = null;

          vm.info = angular.copy(info);
        }
      });
    }

    // get assign history
    function getAssignHistory() {
      StoreApi.assignLog({id: id}).success(function(data) {
        if(data.flag === 1) {
          vm.assignHistory = data.data.map(function(obj) {
            return {
              from: obj.operatorName,
              to: obj.administratorName || obj.groupName,
              type: obj.type,
              date: moment(obj.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            };
          });
        }
      });
    }

    function getRemarkHistory() {
      StoreApi.remarkLog({id: id}).success(function(data) {
        if(data.flag === 1) {
          vm.remarkHistory = data.data.map(function(obj) {
            return {
              name: obj.realname || '--',
              remark: obj.remark,
              date: moment(obj.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            };
          });
        }
      });
    }
    
    function save() {
      var params = angular.copy(vm.info);
      params.userId = user.uId;

      StoreApi.update(params).success(function(data) {
        if(data.flag === 1) {
          toastr.success('信息保存成功！');

          // reset data
          init();
        } else {
          toastr.error(data.msg);
        }
      }).error(function() {
        toastr.error('出错了~');
      })
    }

  }
})();
