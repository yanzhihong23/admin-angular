(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, $state, $stateParams, ApiService, UserService, toastr) {
    $log.debug('MainController start');
    var vm = this;

    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    // methods
    vm.modify = modify;
    vm.assign = assign;
    vm.pageChanged = getDataList;
    

    vm.user = UserService.getUser();

    // init
    if($stateParams.back === 'true') {
      var data = UserService.getDataList();
      vm.itemsPerPage = data.itemsPerPage;
      vm.currentPage = data.currentPage;
      vm.totalItems = data.totalItems;
      vm.list = data.list;
    } else {
      getDataList({
        pageIndex: vm.currentPage
      });
    }

    function getDataList(obj) {
      var params = {
        cityId: obj && obj.cityId,
        cooperationType: obj && obj.cooperationType,
        customerSource: obj && obj.customerSource,
        status: obj && obj.status,
        username: vm.user.username,
        pageIndex: vm.currentPage,
        pageSize: vm.itemsPerPage
      };

      ApiService.getDataList(params).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.totalItems = data.data.dataCount;

          vm.list = data.data.result.map(function(obj) {
            return {
              id: obj.msgid,
              cityId: obj.ccity,
              customerType: obj.custype,
              email: obj.email,
              status: obj.dtlsts,
              name: obj.name,
              phone: obj.phone,
              receiveDate: obj.protim,
              qq: obj.qq,
              wechat: obj.wx,
              callCount: obj.phncnt,
              lastCallDate: obj.lastphntim,
              sourceDetail: obj.srcdtl,
              customerSource: obj.cussrc,
              saleman: obj.salman,
              remark: obj.remark
            };
          })
        } else {
          vm.totalItems = 0;
        }
      })
    }

    function modify(index) {
      $log.debug(index);
      
      UserService.setDataList({
        itemsPerPage: vm.itemsPerPage,
        currentPage: vm.currentPage,
        totalItems: vm.totalItems,
        list: vm.list
      });

      UserService.setItem(vm.list[index]);
      $state.go('detail', {index: index});
    }

    function assign() {
      $state.go('assign');
    }

    $log.debug('MainController end');
  }
})();
