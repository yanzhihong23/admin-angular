(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController(moment, $scope, $interval, $uibModal) {
    var vm = this;

    vm.changePassword = changePassword;

    function ticker() {
      vm.date = moment().format('YYYY-MM-DD  HH:mm');
    }

    function changePassword() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/password/password.html',
        controller: 'PasswordController',
        controllerAs: 'pwd',
        size: '', // lg, sm
      });
    }
      
    ticker();

    $interval(function() {
      ticker();
    }, 60000);
    
  }

})();