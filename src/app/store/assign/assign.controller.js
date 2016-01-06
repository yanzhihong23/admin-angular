(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('StoreAssignController', StoreAssignController);

  /** @ngInject */
  function StoreAssignController($scope, $log, $state, $stateParams, ApiService, UserService, toastr) {
    var vm = this, 
        taskIds = $stateParams.id,
        user = UserService.getUser(),
        updated = false;
        
    vm.loadCompleted = false;
    vm.selectedCount = 0;
    vm.selectedIds = [];
    vm.assignType = +user.roleId === 1 ? 'team' : 'member';
    vm.auto = $state.current.name === 'task.auto';
    vm.getGroupList = getGroupList;
    vm.getMemberList = getMemberList;
    vm.assign = assign;
    vm.select = select;
    vm.save = save;

    // init
    if(vm.assignType === 'team') {
      getGroupList();
    } else {
      getMemberList();
    }

    function select(isRevert) {
      vm.selectedCount = 0;
      vm.selectedIds = [];
      vm.groupList.forEach(function(group) {
        group.memberList.forEach(function(member) {
          if(isRevert) {
            member.selected = !member.selected;
          }
          if(member.selected) {
            vm.selectedIds.push(member.userId);
            vm.selectedCount += 1;
          }
        });
      })
    }

    function save() {
      ApiService.autoAllotOpen({
        userId: user.uId,
        ids: vm.selectedIds.join(';')
      }).success(function(data) {
        if(data.flag === 1) {
          user.autoAllot = true;
          UserService.setUser(user);
          toastr.success('自动分配开启成功');
        } else {
          toastr.error(data.msg);
        }
      });
    }

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

          var length = vm.groupList.length, count = 0;

          vm.groupList.forEach(function(obj) {
            ApiService.memberList({orgId: obj.orgId}).success(function(data) {
              if(data.flag === 1) {
                obj.memberList = data.data.result.map(function(obj) {
                  return {
                    isLeader: obj.isleader === '1',
                    email: obj.email,
                    userId: obj.user_id,
                    phone: obj.mobile,
                    name: obj.realname,
                    tasks: obj.workcount
                  };
                });

                count++;
                if(count === length) {
                  vm.loadCompleted = true;
                }
              }
            });
          });

          $log.debug(vm.groupList)
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
              phone: obj.mobile,
              name: obj.realname,
              tasks: obj.workcount
            };
          });
        }
      })
    }

    function assignHandler(isLast) {
      return function(data) {
        if(data.flag === 1) {
          updated = true;
          if(isLast) {
            toastr.success('任务分配成功');
            $state.reload();
          }
        } else {
          toastr.error(data.msg);
        }
      }
    }

    function assign(toId, isToTeam) {
      if(angular.isArray(taskIds)) {
        for(var i=0, len=taskIds.length; i<len; i++) {
          if(isToTeam) {
            assignToTeam(toId, taskIds[i], i === len - 1);
          } else {
            assignToMember(toId, taskIds[i], i === len - 1);
          }
        }
      } else {
        if(isToTeam) {
          assignToTeam(toId, taskIds, true);
        } else {
          assignToMember(toId, taskIds, true);
        }
      }
    }

    function assignToTeam(toOrgId, taskId, isLast) {
      ApiService.assignToTeam({
        taskId: taskId,
        orgId: toOrgId,
        userId: user.uId
      }).success(assignHandler(isLast));
    }

    function assignToMember(toUserId, taskId, isLast) {
      ApiService.assignToMember({
        taskId: taskId,
        uId: toUserId,
        userId: user.uId
      }).success(assignHandler(isLast));
      
    }
    
  }
})();
