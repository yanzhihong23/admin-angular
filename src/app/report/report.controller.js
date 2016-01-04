(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('ReportController', ReportController);

  /** @ngInject */
  function ReportController($log, $scope, ApiService) {
    var vm = this;

    vm.filter = {
      startDate: moment().add(-8, 'days'),
      endDate: moment().add(-1, 'days'),
      maxDate: moment().add(-1, 'days')
    };

    $scope.$watch(function() {
      return vm.filter;
    }, function(val) {
      if(typeof val.startDate === 'string') {
        var startDate = val.startDate;
        startDate = startDate.substr(0,4) + '-' + startDate.substr(4, 2) + '-' + startDate.substr(6);
        vm.filter.startDate = moment(startDate);
      }

      if(typeof val.endDate === 'string') {
        var endDate = val.endDate;
        endDate = endDate.substr(0,4) + '-' + endDate.substr(4, 2) + '-' + endDate.substr(6);
        vm.filter.endDate = moment(endDate);
      }

      load();
    }, true);

    load();

    function load() {
      var startDate = vm.filter.startDate,
          endDate = vm.filter.endDate;

      if(typeof startDate === 'object') {
        startDate = startDate.format('YYYYMMDD');
      }

      if(typeof endDate === 'object') {
        endDate = endDate.format('YYYYMMDD');
      }

      var params = {
        startDate: startDate,
        endDate: endDate
      };

      ApiService.flowReport(params).success(function(data) {
        if(data.flag === 1) {
          var total = {
            total: true,
            reportDate: '总计',
            totalFlow: 0,
            validFlow: 0,
            invalidFlow: 0,
            otherFlow: 0,
            inviteCount: 0,
            dealCount: 0,
            validRate: 0,
            invalidRate: 0,
            otherRate: 0,
            inviteRate: 0,
            dealRate: 0
          };

          vm.items = data.data.reportList.map(function(obj) {
            obj.validFlow = obj.validAFlow + obj.validBFlow + obj.validCFlow;
            obj.validRate = obj.validARate + obj.validBRate + obj.validCRate;

            total.totalFlow += obj.totalFlow;
            total.validFlow += obj.validFlow;
            total.invalidFlow += obj.invalidFlow;
            total.otherFlow += obj.otherFlow;
            total.inviteCount += obj.inviteCount;
            total.dealCount += obj.dealCount;

            return obj;
          });

          if(vm.items.length) {
            total.validRate = total.validFlow/total.totalFlow*100;
            total.invalidRate = total.invalidFlow/total.totalFlow*100;
            total.otherRate = total.otherFlow/total.totalFlow*100;
            total.inviteRate = total.inviteCount/total.totalFlow*100;
            total.dealRate = total.dealCount/total.totalFlow*100;

            vm.items.push(total);
          }
        }
      });
    }

  }

})();