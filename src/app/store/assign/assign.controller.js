(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('StoreAssignController', StoreAssignController);

  /** @ngInject */
  function StoreAssignController($scope, $log, $state, $stateParams, StoreApi, UserService, BackService, toastr) {
    var vm = this, 
        ids = $stateParams.id.split(','),
        user = UserService.getUser(),
        updated = false;
        
    vm.loadCompleted = false;
    vm.selectedCount = 0;
    vm.assignType = +user.roleId === 9 ? 'team' : 'member';
    vm.assign = assign;

    // init
    if(vm.assignType === 'team') {
      getGroupList();
    } else {
      getMemberList();
    }

    function getGroupList() {
      StoreApi.groupList(user).success(function(data) {
        if(data.flag === 1) {
          vm.groupList = data.data;

          var length = vm.groupList.length, count = 0;

          vm.groupList.forEach(function(obj) {
            obj.stores = 0;

            StoreApi.groupDetail({orgId: obj.orgId}).success(function(data) {
              if(data.flag === 1) {
                obj.memberList = data.data.list.map(function(_obj) {
                  obj.stores += _obj.totalStore;
                  return {
                    userId: _obj.userId,
                    phone: _obj.mobile,
                    name: _obj.name,
                    stores: _obj.totalStore
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
      StoreApi.groupDetail(user).success(function(data) {
        if(data.flag === 1) {
          vm.memberList = data.data.list.map(function(obj) {
            return {
              userId: obj.userId,
              phone: obj.mobile,
              name: obj.name,
              stores: obj.totalStore
            };
          });
        }
      });
    }

    function assign(toId, isToTeam) {
      StoreApi.assign({
        ids: ids,
        userId: user.uId,
        groupId: isToTeam ? toId : null,
        memberId: isToTeam ? null : toId
      }).success(function(data) {
        if(data.flag === 1) {
          toastr.success('分配成功');
          BackService.goBack();
        } else {
          toastr.error(data.msg);
        }
      });
    }

  }
})();
