(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('AssignController', AssignController);

  /** @ngInject */
  function AssignController($scope, $log, $state, $stateParams, ApiService, UserService, toastr) {
    var vm = this, 
        taskId = $stateParams.id,
        user = UserService.getUser();

    vm.assignType = +user.roleId === 1 ? 'team' : 'member';
    vm.getGroupList = getGroupList;
    vm.getMemberList = getMemberList;
    vm.assignToTeam = assignToTeam;
    vm.assignToMember = assignToMember;
    vm.back = back;

    // init
    if(vm.assignType === 'team') {
      getGroupList();
    } else {
      getMemberList();
    }

    function getGroupList() {
      ApiService.groupList(user).success(function(data) {
        if(data.flag === 1) {
          vm.groupList = data.data.result.map(function(obj) {
            return {
              orgId: obj.orgid,
              name: obj.name,
              members: obj.usercount,
              tasks: obj.workcount
            };
          });
        }
      })
    }

    function getMemberList() {
      ApiService.memberList(user).success(function(data) {
        if(data.flag === 1) {
          vm.memberList = data.data.result.map(function(obj) {
            return {
              isLeader: obj.isleader === '1',
              email: obj.email,
              userId: obj.userid,
              name: obj.username,
              tasks: obj.workcount
            };
          });
        }
      })
    }

    function assignToTeam(index) {
      ApiService.assignToTeam({
        taskId: taskId,
        orgId: vm.groupList[index].orgId
      }).success(function(data) {
        if(data.flag === 1) {
          toastr.success('任务分配成功');
        } else {
          toastr.error(data.msg);
        }
      });
    }

    function assignToMember(index) {
      ApiService.assignToMember({
        taskId: taskId,
        userId: vm.memberList[index].userId
      }).success(function(data) {
        if(data.flag === 1) {
          toastr.success('任务分配成功');
        } else {
          toastr.error(data.msg);
        }
      });
    }

    function back() {
      $state.go('home', {back: true});
    }
    
  }
})();
