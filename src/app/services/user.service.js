(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('UserService', UserService);

  /** @ngInject */
  function UserService(localStorageService, $log) {
    this.setUser = function(user) {
      localStorageService.add('user', user);
    };

    this.getUser = function() {
      return localStorageService.get('user');
    };

    this.setItem = function(item) {
      localStorageService.add('item', item);
    };

    this.getItem = function() {
      return localStorageService.get('item');
    };

    this.setDataList = function(list) {
      localStorageService.add('list', list);
    };

    this.getDataList = function() {
      return localStorageService.get('list');
    };

    $log.debug('UserService end');
    
  }
})();
