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
            switch(roleId) {
              case 0:
              case 1:
              case 2:
              case 3:
                $state.go('task.list');
                break;
            }
          } else if(type === 'store') {
            switch(roleId) {
              case 0:
              case 5:
              case 9:
              case 10:
                $state.go('store.list');
                break;
            }
          }
        }
      }
    };

    return directive;
  }

})();