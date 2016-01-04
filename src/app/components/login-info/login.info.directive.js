(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('loginInfo', loginInfo);

  /** @ngInject */
  function loginInfo() {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/login-info/login.info.html',
      link: function(scope, element, attr) {
        
      }
    };

    return directive;
  }

})();