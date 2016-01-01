(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('ListController', ListController);

  /** @ngInject */
  function ListController($log, $state, $scope, ApiService, UserService, FilterService, toastr, moment) {
    var vm = this, user = UserService.getUser();

    vm.user = user;
    vm.selectedCount = 0;
    vm.itemsPerPage = 10;
    vm.currentPage = 1;
    vm.allowAutoAllot = user.allowAutoAllot;
    vm.filterData = FilterService.filterData;
    vm.filter = FilterService.filter;

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

    // coType watcher
    $scope.$watch(function() {
      return vm.filter.coType;
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
      return vm.filter.memberId
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

      if(user.roleId == 1) { // city ceo
        getGroupList();
      } else if(user.roleId == 2) { // group leader
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
      if(searchFilter.status === '-1') {
        searchFilter.status = null;
      }

      if(searchFilter.coType === '-1') {
        searchFilter.coType = null;
      }

      searchFilter.itemsPerPage = Math.abs(searchFilter.itemsPerPage);
      searchFilter.uId = vm.user.uId;

      ApiService.getDataList(searchFilter).success(function(data) {
        if(data.flag === 1) {
          toastr.info('列表数据已更新');

          vm.selectedCount = 0;
          vm.filter.totalItems = data.data.dataCount;

          vm.list = data.data.result.map(function(obj) {
            return {
              taskId: obj.msgid,
              ccity: obj.ccity,
              city: obj.city,
              groupId: obj.cgroup,
              customerType: obj.custype,
              email: obj.email,
              assigned: !/0|2|7/.test(obj.status_type),
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
              remark: obj.remark,
              provinceId: obj.province_id ? obj.province_id + '' : '-1',
              cityId: obj.city_id ? obj.city_id + '' : '-1'
            };
          })
        } else {
          vm.filter.totalItems = 0;
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
      var ids = getSelectedIds();

      $state.go('task.assign', {id: ids});
    }

    function recovery(index) {
      var taskId = vm.list[index].taskId;

      ApiService.recovery({
        taskId: taskId,
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
        return obj.taskId;
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
      ApiService.groupList(user).success(function(data) {
        if(data.flag === 1) {
          vm.groupList = data.data.result.map(function(obj) {
            return {
              orgId: obj.orgid,
              name: obj.name,
              leader: obj.realname,
              members: obj.usercount,
              tasks: obj.workcount
            };
          });

          vm.groupList.forEach(function(obj) {
            ApiService.memberList({orgId: obj.orgId}).success(function(data) {
              if(data.flag === 1) {
                obj.memberList = data.data.result.map(function(obj) {
                  return {
                    isLeader: obj.isleader === '1',
                    email: obj.email,
                    userId: obj.user_id,
                    name: obj.realname,
                    tasks: obj.workcount
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
      ApiService.memberList(user).success(function(data) {
        if(data.flag === 1) {
          vm.memberList = data.data.result.map(function(obj) {
            return {
              isLeader: obj.isleader === '1',
              email: obj.email,
              userId: obj.user_id,
              name: obj.realname,
              tasks: obj.workcount
            };
          });
        }
      })
    }

  }
})();
