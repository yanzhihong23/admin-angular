(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('asideNav', asideNav);

  /** @ngInject */
  function asideNav($interval, moment) {
    var directive = {
      restrict: 'E',
      scope: true,
      replace: true,
      templateUrl: 'app/components/aside-nav/aside.nav.html',
      link: function(scope, element, attr) {
        scope.active = attr.active;
      }
    };

    return directive;
  }

})();