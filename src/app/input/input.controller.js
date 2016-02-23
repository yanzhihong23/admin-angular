(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('InputController', InputController);

  /** @ngInject */
  function InputController($scope, SystemApi, $log, UserService, ApiService, toastr) {
    var vm = this,
        user = UserService.getUser(),
        cityList;

    vm.submit = submit;
    vm.reset = reset;

    reset();
    initChannel();
    initProvince();

    $scope.$watch(function() {
      return vm.info.provinceId;
    }, function(val) {
      if(val != -1) {
        // reset city
        vm.info.cityId = '-1';
        initCity(val);
      }
    });

    function initChannel() {
      SystemApi.channelList().success(function(data) {
        if(data.flag === 1) {
          vm.channelList = data.channelInfo.map(function(obj) {
            return {
              name: obj.channelName,
              id: obj.channelId
            };
          });
        }
      });
    }

    function initProvince() {
      SystemApi.provinceList().success(function(data) {
        vm.provinceList = data.map(function(obj) {
          return {
            id: obj.provinceId,
            name: obj.provinceName
          };
        });
      });
    }

    function initCity(id) {
      var doFilter = function() {
        vm.cityList = cityList.filter(function(obj) {
          return obj.provinceId == id;
        });
      };

      if(cityList) {
        doFilter();
      } else {
        SystemApi.cityList().success(function(data) {
          cityList = data.map(function(obj) {
            return {
              name: obj.cityName,
              id: obj.cityId + '',
              provinceId: obj.provinceId
            };
          });

          doFilter();
        });
      }
    }

    function submit() {
      $log.debug(JSON.stringify(vm.info));
      ApiService.input(vm.info).success(function(data) {
        if(data.flag === 1) {
          toastr.success('录入成功');
        } else {
          toastr.error(data.msg);
        }
      });
    }

    function reset() {
      vm.info = {
        userId: user.uId,
        provinceId: '-1',
        cityId: '-1',
        channelId: '-1',
        coType: '-1',
        ccity: '21'
      };
    }

    
  }
})();