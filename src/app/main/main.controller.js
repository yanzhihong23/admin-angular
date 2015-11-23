(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, $state, $stateParams, ApiService, UserService, toastr, moment) {
    $log.debug('MainController start');
    var vm = this;

    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    vm.statusFilter = ['1', '01', '02', '11', '12', '13', '14'];
    // methods
    vm.modify = modify;
    vm.assign = assign;
    vm.pageChanged = getDataList;
    vm.filter = filter;

    var searchFilter = {};
    

    vm.user = UserService.getUser();

    // init
    if($stateParams.back === 'true') {
      var data = UserService.getDataList();
      vm.itemsPerPage = data.itemsPerPage;
      vm.currentPage = data.currentPage;
      vm.totalItems = data.totalItems;
      vm.list = data.list;
      searchFilter = data.searchFilter;
    } else {
      getDataList({
        pageIndex: vm.currentPage
      });
    }

    function filter(index) {
      if(angular.isDefined(index)) {
        if(index === 0) { // assigned
          searchFilter = {status: 1};
        } else {
          searchFilter = {subStatus: vm.statusFilter[index]};
        }
      } else { // reset
        searchFilter = {};
      }

      getDataList();
    }

    function getDataList() {
      ApiService.getDataList(searchFilter).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.totalItems = data.data.dataCount;

          vm.list = data.data.result.map(function(obj) {
            return {
              taskId: obj.msgid,
              cityId: obj.ccity,
              groupId: obj.cgroup,
              customerType: obj.custype,
              email: obj.email,
              assigned: obj.txnsts === '1',
              assignDate: obj.allot_date && moment(obj.allot_date).format('YYYY-MM-DD HH:mm:ss'),
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
              saleman: obj.crewRealName,
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
      
      setTempData();

      $state.go('detail', {index: index});
    }

    function assign(index) {
      var taskId = vm.list[index].taskId;

      setTempData();

      $state.go('assign', {id: taskId});
    }

    function setTempData() {
      UserService.setDataList({
        itemsPerPage: vm.itemsPerPage,
        currentPage: vm.currentPage,
        totalItems: vm.totalItems,
        list: vm.list,
        searchFilter: searchFilter
      });
    }

    $log.debug('MainController end');
  }
})();
