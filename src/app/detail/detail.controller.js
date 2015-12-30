(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('DetailController', DetailController);

  /** @ngInject */
  function DetailController($log, $state, $scope, $stateParams, $location, UserService, ApiService, SystemApi, CallApi, StatusService, AddressService, toastr, moment) {
    var vm  = this, 
        index = $stateParams.index,
        cachedData,
        user = UserService.getUser(),
        list,
        cityList,
        statusList = angular.copy(StatusService.getStatusList());

    statusList.shift();

    vm.provinceList = AddressService.provinceList;
    cityList = AddressService.cityList;

    vm.statusList = statusList;
    vm.save = save;
    vm.back = back;
    vm.dial = dial;
    vm.hangup = hangup;

    init();

    $scope.$watch(function() {
      return vm.info.provinceId;
    }, function(val, old) {
      if(val != -1) {
        // reset city
        // vm.info.cityId = '-1';
        initCity(val);
        if(val!==old) {
          vm.info.cityId = '-1';
        }
      }
    });

    $scope.$watch(function() {
      return vm.info.invite;
    }, function(val) {
      if(val) {
        vm.info.inviteTime = moment(val).format('YYYY-MM-DD HH:mm');
        $log.debug(vm.info.inviteTime);
      }
    })

    function init() {
      cachedData = UserService.getDataList();
      list = cachedData.list;

      vm.info = angular.copy(list[index]);
      vm.info.curStatus = vm.info.status; // for save check
      vm.info.remark = '';

      $log.debug(vm.info.provinceId)

      getAssignHistory();
      getStatusHistory();
      getRemarkHistory();
      getCallHistory();
    }

    function initCity(id) {
      vm.cityList = cityList.filter(function(obj) {
        return obj.provinceId == id;
      });
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
            };
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
            };
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
            };
          });
        }
      });
    }

    function getCallHistory() {
      ApiService.callHistory({taskId: vm.info.taskId}).success(function(data) {
        if(data.flag === 1) {
          vm.callHistory = data.data.callingLog.map(function(obj) {
            return {
              name: obj.realname,
              src: obj.recordUrl,
              duration: obj.holdingTime,
              date: moment(obj.beginDate).format('YYYY-MM-DD HH:mm:ss')
            };
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

          cachedData.list[index] = vm.info;
          UserService.setDataList(cachedData);

          // reset data
          init();
          // load next item
          loadNext && next();
        } else {
          toastr.error(data.msg);
        }
      }).error(function() {
        toastr.error('出错了~');
      })
    }

    function back() {
      // $state.go('task.list', {back: true});
      $state.go('task.list');
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
      CallApi.dial({
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
      CallApi.hangup({
        userId: user.uId,
        destPhone: vm.info.phone,
        taskId: vm.info.taskId
      }).success(function() {
        vm.calling = false;
        toastr.success('挂断成功');
      })
    }
  }
})();
