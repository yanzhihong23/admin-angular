(function() {
  'use strict';

  angular
    .module('adminAngular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $state, $rootScope, UserService, StatusService, AddressService, BackService) {
    var user = UserService.getUser();
    $rootScope.user = $rootScope.user || user;

    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      if(toState.name === 'login') {
        if($rootScope.user) {
          evt.preventDefault();
          $state.go('task.list');
        }
      } else {
        if(!$rootScope.user) {
          evt.preventDefault();
          $state.go('login');
        } else if(/task/.test(toState.name)) {
          // user rights check
          switch(toState.name) {
            case 'task.report':
              if(!$rootScope.user.rights.report) {
                evt.preventDefault();
              }
              break;
            case 'task.assign':
              if(!$rootScope.user.rights.assign) {
                evt.preventDefault();
              }
              break;
            case 'task.auto':
              if(!$rootScope.user.rights.autoAssign) {
                evt.preventDefault();
              }
              break;
            case 'task.input':
              if(!$rootScope.user.rights.input) {
                evt.preventDefault();
              }
              break;
          }
        }
      }

      
    });

    $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
      // reset scroll
      document.documentElement.scrollTop = document.body.scrollTop = 0;
      document.documentElement.scrollLeft = document.body.scrollLeft = 0;

      // save previous view
      BackService.setBackView(fromState, fromParams);
    });

    $rootScope.logout = function() {
      $log.debug('logout');

      UserService.logout();
    };

    moment.locale('zh-cn');

    $log.debug('runBlock end');
  }

})();
