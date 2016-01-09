(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('asideNav', asideNav);

  /** @ngInject */
  function asideNav($rootScope, $state) {
    var directive = {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'app/components/aside-nav/aside.nav.html',
      link: function(scope, element, attr) {
        var roleId = $rootScope.user.roleId;
        scope.active = attr.active;

        scope.select = function(type) {
          if(type === 'task') {
            if(/0|1|2|3/.test(roleId)) {
              $state.go('task.list');
            }
          } else if(type === 'store') {
            if(/0|5|9|10/.test(roleId)) {
              $state.go('store.list');
            }
          }
        }
      }
    };

    return directive;
  }

})();