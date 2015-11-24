(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('DetailController', DetailController);

  /** @ngInject */
  function DetailController($log, $state, $stateParams, $location, UserService, ApiService, toastr) {
    var vm  = this, 
        index = $stateParams.index,
        cachedData = UserService.getDataList(),
        list = cachedData.list;

    vm.save = save;
    vm.back = back;


    vm.info = angular.copy(list[index]);
    
    function save() {
      $log.debug('save');
      ApiService.updateData(vm.info).success(function(data) {
        if(data.flag === 1) {
          toastr.success('信息保存成功！', '已自动为您载入下一条数据！');

          cachedData.list[index] = vm.info;
          UserService.setDataList(cachedData);
          next();
        } else {
          toastr.error(data.msg);
        }
      }).error(function(data) {
        toastr.error('出错了~');
      })
    }

    function back() {
      $state.go('home', {back: true});
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
  }
})();
