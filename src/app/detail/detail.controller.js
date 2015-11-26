(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('DetailController', DetailController);

  /** @ngInject */
  function DetailController($log, $state, $stateParams, $location, UserService, ApiService, CallService, StatusService, toastr, moment) {
    var vm  = this, 
        index = $stateParams.index,
        cachedData = UserService.getDataList(),
        user = UserService.getUser(),
        list = cachedData.list,
        statusList = angular.copy(StatusService.getStatusList());

    statusList.shift();

    vm.statusList = statusList;
    vm.save = save;
    vm.back = back;
    vm.dial = dial;
    vm.hangup = hangup;

    init();

    function init() {
      vm.info = angular.copy(list[index]);
      vm.info.curStatus = vm.info.status; // for save check
      vm.info.remark = '';

      getAssignHistory();
      getStatusHistory();
      getRemarkHistory();
    }

    // get assign history
    function getAssignHistory() {
      ApiService.assignHistory({taskId: vm.info.taskId}).success(function(data) {
        if(data.flag === 1) {
          vm.assignHistory = data.data.dispatchDetail.map(function(obj) {
            return {
              from: obj.fromRealname,
              to: obj.toRealname,
              date: moment(obj.allotTime).format('YYYY-MM-DD HH:mm:ss')
            }
          });
        }
      });
    }

    function getStatusHistory() {
      ApiService.statusHistory({taskId: vm.info.taskId}).success(function(data) {
        if(data.flag === 1) {
          vm.statusHistory = data.data.statusLogList.map(function(obj) {
            return {
              name: obj.realname,
              status: obj.statusType,
              date: moment(obj.changeDate).format('YYYY-MM-DD HH:mm:ss')
            }
          });
        }
      });
    }

    function getRemarkHistory() {
      ApiService.remarkHistory({taskId: vm.info.taskId}).success(function(data) {
        if(data.flag === 1) {
          vm.remarkHistory = data.data.remarkLogList.map(function(obj) {
            return {
              name: obj.realname,
              remark: obj.changeRemark,
              date: moment(obj.changeDate).format('YYYY-MM-DD HH:mm:ss')
            }
          });
        }
      });
    }
    
    function save(loadNext) {
      var params = angular.copy(vm.info);
      params.userId = user.uId;
      if(vm.info.status === vm.info.curStatus) {
        params.status = null;
      }

      ApiService.updateData(params).success(function(data) {
        if(data.flag === 1) {
          toastr.success('信息保存成功！', loadNext ? '已自动为您载入下一条数据！': '');
          // reset data
          init();

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
        init();
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
