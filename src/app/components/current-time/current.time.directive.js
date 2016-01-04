(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('currentTime', currentTime);

  /** @ngInject */
  function currentTime($interval, moment) {
    var directive = {
      restrict: 'EA',
      scope: true,
      template: '{{date}}',
      link: function(scope, element, attr) {
        function ticker() {
          scope.date = moment().format('YYYY-MM-DD  HH:mm');
        }

        ticker();

        $interval(ticker, 60000);
      }
    };

    return directive;
  }

})();