(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('backButton', backButton);

  /** @ngInject */
  function backButton(BackService) {
    var directive = {
      restrict: 'E',
      scope: true,
      replace: true,
      template: '<button type="button" class="btn btn-default" ng-click="back()">返回</button>',
      link: function(scope, element, attr) {
        scope.back = function() {
          BackService.goBack();
        };
      }
    };

    return directive;
  }

})();