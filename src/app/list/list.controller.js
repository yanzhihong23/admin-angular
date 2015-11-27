(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('ListController', ListController);

  /** @ngInject */
  function ListController($log, $state, $stateParams, $scope, ApiService, UserService, StatusService, toastr, moment) {
    var vm = this;
    var statusList = StatusService.getStatusList();

    vm.user = UserService.getUser();
    vm.selectedCount = 0;
    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    vm.filterData = { // -1 for all, and fix empty option
      status: statusList,
      coType: ['-1', '1', '2'],
      itemsPerPage: ['-1', 10, 15, 20, 25, 30]
    };
    vm.filter = {
      status: '-1',
      coType: '-1',
      itemsPerPage: '10'
    };

    // methods
    vm.modify = modify;
    vm.assign = assign;
    vm.batchAssign = batchAssign;
    vm.pageChanged = updateDataList;
    vm.select = select;
    vm.search = search;

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

    var searchFilter = {
      uId: vm.user.uId,
      pageSize: vm.itemsPerPage
    };

    // init
    if($stateParams.back === 'true') {
      var data = UserService.getDataList();
      vm.itemsPerPage = data.itemsPerPage;
      vm.currentPage = data.currentPage;
      vm.totalItems = data.totalItems;
      vm.list = data.list;
      vm.filter = data.filter;
      searchFilter = data.searchFilter;
    } else {
      updateDataList({
        pageIndex: vm.currentPage
      });
    }

    function doStatusFilter(val) {
      searchFilter.status = val === '-1' ? null : val;
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

    function select(isInvert) {
      vm.selectedCount = 0;
      vm.list.forEach(function(obj) {
        if(isInvert) {
          obj.selected = !obj.selected;
        }
        if(obj.selected && !obj.assigned) {
          vm.selectedCount += 1;
        }
      });
    }

    function search(evt) {
      searchFilter.searchStr = vm.filter.searchStr;
      if(evt.keyCode === 13) { // enter
        updateDataList();
      }
    }

    function updateDataList() {
      searchFilter.pageIndex = vm.currentPage;
      ApiService.getDataList(searchFilter).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.selectedCount = 0;
          vm.totalItems = data.data.dataCount;

          vm.list = data.data.result.map(function(obj) {
            return {
              taskId: obj.msgid,
              cityId: obj.ccity,
              groupId: obj.cgroup,
              customerType: obj.custype,
              email: obj.email,
              assigned: obj.status_type === 1,
              assignDate: obj.allot_date && moment(obj.allot_date).format('YYYY-MM-DD HH:mm:ss'),
              status: obj.status_type + '',
              name: obj.name,
              phone: obj.phone,
              receiveDate: obj.protim,
              qq: obj.qq,
              wechat: obj.wx,
              callCount: obj.phncnt,
              lastCallDate: obj.lastphntim,
              sourceDetail: obj.srcdtl,
              customerSource: obj.channelName,
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
      setTempData();

      $state.go('task.detail', {index: index});
    }

    function assign(index) {
      var taskId = vm.list[index].taskId;

      setTempData();

      $state.go('task.assign', {id: taskId});
    }

    function batchAssign() {
      var ids = vm.list.filter(function(obj) {
        return obj.selected && !obj.assigned;
      }).map(function(obj) {
        return obj.taskId;
      });

      $state.go('task.assign', {id: ids});
    }

    function setTempData() {
      UserService.setDataList({
        itemsPerPage: vm.itemsPerPage,
        currentPage: vm.currentPage,
        totalItems: vm.totalItems,
        list: vm.list,
        filter: vm.filter,
        searchFilter: searchFilter
      });
    }

  }
})();
