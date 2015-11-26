(function() {
  'use strict';

  angular
    .module('adminAngular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $state, $rootScope, UserService, StatusService) {
    var user = UserService.getUser();
    $rootScope.user = $rootScope.user || user;

    $rootScope.$on('$stateChangeStart', function(evt, toState, fromState, fromParams) {
      $log.debug('toState', toState.name);
      switch(toState.name) {
        case 'login':
          break;
        case 'task.list':
          // handle user refresh page
          if(fromParams.name === '' && fromState.back === 'true') {
            evt.preventDefault();
            $state.go('task.list');
          }
        default:
          if(!$rootScope.user) {
            evt.preventDefault();
            $state.go('login');
          }
      }
    });

    $rootScope.logout = function() {
      $log.debug('logout');

      $rootScope.user = null;
      UserService.logout();
    };

    $log.debug('runBlock end');
  }

})();
