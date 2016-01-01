(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('ReportController', ReportController);

  /** @ngInject */
  function ReportController($scope, ApiService) {
    var vm = this;

    vm.filter = {
      startDate: moment().add(-7, 'days').format('YYYYMMDD'),
      endDate: moment().format('YYYYMMDD')
    };

    $scope.$watch(function() {
      return vm.filter;
    }, function(val) {
      load();
    }, true);

    load();

    function load() {
      ApiService.flowReport(vm.filter).success(function(data) {
        if(data.flag === 1) {
          vm.items = data.data.reportList.map(function(obj) {
            obj.validFlow = obj.validAFlow + obj.validBFlow + obj.validCFlow;
            obj.validRate = obj.validARate + obj.validBRate + obj.validCRate;

            return obj;
          });
        }
      });
    }

  }

})();