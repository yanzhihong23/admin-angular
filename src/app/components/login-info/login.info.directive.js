(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('loginInfo', loginInfo);

  /** @ngInject */
  function loginInfo($rootScope) {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'app/components/login-info/login.info.html',
      link: function(scope, element, attr) {
        scope.toggle = function() {
          $rootScope.hideAside = !$rootScope.hideAside;
        }
      }
    };

    return directive;
  }

})();