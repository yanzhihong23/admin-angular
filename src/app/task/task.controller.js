(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('TaskController', TaskController);

  /** @ngInject */
  function TaskController(moment, $interval) {
    var vm = this;

    function ticker() {
      vm.date = moment().format('YYYY-MM-DD  HH:mm');
    }
      
    ticker();

    $interval(function() {
      ticker();
    }, 60000);
    
  }

})();