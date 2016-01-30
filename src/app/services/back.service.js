(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('BackService', BackService);

  /** @ngInject */
  function BackService(localStorageService, $log, $state) {
    this.setBackView = function(fromState, fromParams) {
      if(fromState.name) {
        localStorageService.set('backView', {
          state: fromState.name,
          params: fromParams
        });
      }
    };

    this.goBack = function() {
      var backView = localStorageService.get('backView');
      if(backView) {
        $state.go(backView.state, backView.params);
      }
    };

    $log.debug('BackService end');
    
  }
})();
