(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log, $state, $stateParams, $scope, ApiService, UserService, toastr, moment) {
    $log.debug('MainController start');
    var vm = this;

    vm.user = UserService.getUser();
    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    vm.filterData = { // -1 for all, and fix empty option
      status: ['-1', '1', '01', '02', '11', '12', '13', '14'],
      coType: ['-1', '1', '2'],
      itemsPerPage: ['-1', 10, 15, 20, 25, 30]
    };
    vm.filter = {
      status: '-1',
      coType: '-1',
      itemsPerPage: '10'
    };

    // status watcher
    $scope.$watch(function() {
      return vm.filter.status;
    }, function(val, old) {
      if(val !== old) {
        doStatusFilter(val);
      }
    }, true);

    // coType watcher
    $scope.$watch(function() {
      return vm.filter.coType;
    }, function(val, old) {
      if(val !== old) {
        doCoTypeFilter(val);
      }
    }, true); 

    // paginator watcher
    $scope.$watch(function() {
      return vm.filter.itemsPerPage;
    }, function(val, old) {
      if(val !== old) {
        doPaginatorFilter(val);
      }
    }, true);  

    // methods
    vm.modify = modify;
    vm.assign = assign;
    vm.batchAssign = batchAssign;
    vm.pageChanged = updateDataList;
    vm.selectAll = selectAll;

    var searchFilter = {
      username: vm.user.username,
      // pageIndex: vm.currentPage,
      pageSize: vm.itemsPerPage
    };

    // init
    if($stateParams.back === 'true') {
      var data = UserService.getDataList();
      vm.itemsPerPage = data.itemsPerPage;
      vm.currentPage = data.currentPage;
      vm.totalItems = data.totalItems;
      vm.list = data.list;
      searchFilter = data.searchFilter;
    } else {
      updateDataList({
        pageIndex: vm.currentPage
      });
    }

    function doStatusFilter(val) {
      switch(val) {
        case '-1': // all
          searchFilter.status = null;
          searchFilter.subStatus = null;
          break;
        case '1': // assigned
          searchFilter.status = 1;
          searchFilter.subStatus = null;
          break;
        default:
          searchFilter.status = null;
          searchFilter.subStatus = val;
      }

      updateDataList();
    }

    function doCoTypeFilter(val) {
      searchFilter.coType = val === '-1' ? null : val;
      updateDataList();
    }

    function doPaginatorFilter(val) {
      searchFilter.pageSize = vm.itemsPerPage = Math.abs(val);
      updateDataList();
    }

    function selectAll() {
      vm.selectedCount = 0;
      vm.list.forEach(function(obj) {
        obj.selected = !obj.selected;
        if(obj.selected && !obj.assigned) {
          vm.selectedCount += 1;
        }
      });
    }

    function updateDataList() {
      searchFilter.pageIndex = vm.currentPage;
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

    function batchAssign() {
      var ids = vm.list.filter(function(obj) {
        return obj.selected && !obj.assigned;
      }).map(function(obj) {
        return obj.taskId;
      });

      $state.go('assign', {id: ids});
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
