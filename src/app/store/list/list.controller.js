(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('StoreListController', StoreListController);

  /** @ngInject */
  function StoreListController($log, $state, $scope, StoreApi, UserService, FilterService, toastr, moment) {
    var vm = this, user = UserService.getUser();

    vm.user = user;
    vm.selectedCount = 0;
    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    vm.filterData = FilterService.storeFilterData;
    vm.filter = FilterService.storeFilter;

    // methods
    vm.modify = modify;
    vm.assign = assign;
    vm.recovery = recovery;
    vm.batchAssign = batchAssign;
    vm.pageChanged = updateDataList;
    vm.select = select;
    vm.search = search;

    // status watcher
    $scope.$watch(function() {
      return vm.filter.status;
    }, function(val, old) {
      if(val !== old) {
        updateDataList();
      }
    }, true);

    // paginator watcher
    $scope.$watch(function() {
      return vm.filter.itemsPerPage;
    }, function(val, old) {
      if(val !== old) {
        updateDataList();
      }
    }, true);

    // group watcher
    $scope.$watch(function() {
      return vm.filter.orgId;
    }, function(val, old) {
      if(val !== old) {
        vm.filter.memberId = '-1';
        if(val == -1) {
          vm.memberList = null;
        }
        updateDataList();
        vm.groupList.forEach(function(group) {
          if(group.orgId == val) {
            vm.memberList = group.memberList;
          }
        });
      }
    }, true);

    // member watcher
    $scope.$watch(function() {
      return vm.filter.memberId;
    }, function(val, old) {
      if(val !== old) {
        updateDataList();
      }
    }, true);

    // date watcher
    $scope.$watch(function() {
      return vm.filter.startDate;
    }, function(val, old) {
      if(val !== old) {
        updateDataList();
      }
    }, true);

    // date watcher
    $scope.$watch(function() {
      return vm.filter.endDate;
    }, function(val, old) {
      if(val !== old) {
        updateDataList();
      }
    }, true);

    init();

    // init
    function init() {
      updateDataList({
        pageIndex: vm.currentPage
      });

      if(user.roleId == 9) { // city ceo
        getGroupList();
      } else if(user.roleId == 10) { // group leader
        getMemberList();
      }
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
      if(evt.keyCode === 13) { // enter
        updateDataList();
      }
    }

    function updateDataList() {
      var searchFilter = angular.copy(vm.filter);
      searchFilter.userId = vm.user.uId;
      searchFilter.startDate = searchFilter.startDate.format('YYYY-MM-DD');
      searchFilter.endDate = searchFilter.endDate.format('YYYY-MM-DD');

      StoreApi.list(searchFilter).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.selectedCount = 0;
          vm.filter.totalItems = data.data.total;

          vm.list = data.data.list.map(function(obj) {
            return {
              id: obj.storeId,
              assigned: /2/.test(obj.status), // 0: 未分配, 1: 组内未分配, 2: 已分配
              status: obj.status,
              name: obj.shopName,
              area: obj.provinces,
              owner: obj.businessName,
              phone: obj.phone,
              assignedTeam: obj.groupName || '-',
              assignedMember: obj.administrator || '-',
              date: moment(obj.shopDate).format('YYYY-MM-DD')
            };
          })
        } else {
          vm.filter.totalItems = 0;
        }
      })
    }

    function modify(id) {
      $state.go('store.detail', {id: id});
    }

    function assign(id) {
      $state.go('store.assign', {id: id});
    }

    function batchAssign() {
      var ids = getSelectedIds();

      $state.go('store.assign', {id: ids});
    }

    function recovery(id) {
      StoreApi.recover({
        id: id,
        userId: vm.user.uId
      }).success(function(data) {
        if(data.flag === 1) {
          toastr.success('回收成功');
          updateDataList();
        } else {
          toastr.error('回收失败');
        }
      })
    }

    function getSelectedIds() {
      var ids = vm.list.filter(function(obj) {
        return obj.selected && !obj.assigned;
      }).map(function(obj) {
        return obj.id;
      });

      return ids;
    } 

    function setTempData() {
      UserService.setDataList({
        list: vm.list
      });
    }

    // group list and member list
    function getGroupList() {
      StoreApi.groupList(user).success(function(data) {
        if(data.flag === 1) {
          vm.groupList = data.data;

          vm.groupList.forEach(function(obj) {
            StoreApi.groupDetail({orgId: obj.orgId}).success(function(data) {
              if(data.flag === 1) {
                obj.memberList = data.data.list.map(function(obj) {
                  return {
                    memberId: obj.userId,
                    name: obj.name
                  };
                });
              }
            });
          });

          $log.debug(vm.groupList);
        }
      });
    }

    function getMemberList() {
      StoreApi.groupDetail(user).success(function(data) {
        if(data.flag === 1) {
          vm.memberList = data.data.list.map(function(obj) {
            return {
              memberId: obj.userId,
              name: obj.name
            };
          });
        }
      })
    }

  }
})();