(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('DetailController', DetailController);

  /** @ngInject */
  function DetailController($log, $state, $stateParams, $location, UserService, ApiService, CallService, toastr) {
    var vm  = this, 
        index = $stateParams.index,
        cachedData = UserService.getDataList(),
        user = UserService.getUser(),
        list = cachedData.list;

    vm.save = save;
    vm.back = back;
    vm.dial = dial;
    vm.hangup = hangup;


    vm.info = angular.copy(list[index]);
    
    function save(loadNext) {
      $log.debug('save');
      ApiService.updateData(vm.info).success(function(data) {
        if(data.flag === 1) {
          toastr.success('信息保存成功！', loadNext ? '已自动为您载入下一条数据！': '');

          cachedData.list[index] = vm.info;
          UserService.setDataList(cachedData);
          loadNext && next();
        } else {
          toastr.error(data.msg);
        }
      }).error(function(data) {
        toastr.error('出错了~');
      })
    }

    function back() {
      $state.go('task.list', {back: true});
    }

    function next() {
      if(index < list.length - 1) {
        index++;
        // update location search
        $location.search('index', index);
        // load next item
        vm.info = angular.copy(list[index]);
      } else {
        toastr.error('没有数据了，请先返回吧~');
      }
    }

    function dial() {
      CallService.dial({
        userId: user.uId,
        destPhone: vm.info.phone,
        taskId: vm.info.taskId
      }).success(function(data) {
        if(data.flag === 1) {
          toastr.success('呼叫成功');
          vm.calling = true;
        } else {
          toastr.error('呼叫失败');
          vm.calling = false;
        }
      })
    }

    function hangup() {
      CallService.hangup({
        userId: user.uId,
        destPhone: vm.info.phone,
        taskId: vm.info.taskId
      }).success(function(data) {
        vm.calling = false;
        toastr.success('挂断成功');
      })
    }
  }
})();
