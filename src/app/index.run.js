(function() {
  'use strict';

  angular
    .module('adminAngular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $state, $rootScope, UserService) {
    var user = UserService.getUser();

    $rootScope.$on('$stateChangeStart', function(evt, toState, fromState, fromParams) {
      $log.debug('toState', toState.name);
      switch(toState.name) {
        case 'login':
          break;
        case 'home':
          // handle user refresh page
          if(fromParams.name === '' && fromState.back === 'true') {
            evt.preventDefault();
            $state.go('home');
          }
        default:
          if(!user) {
            evt.preventDefault();
            $state.go('login');
          }
      }
    });

    $log.debug('runBlock end');
  }

})();
