(function() {
  'use strict';

  angular
    .module('adminAngular')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/?back',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('detail', {
        url: '/detail?index',
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailController',
        controllerAs: 'detail'
      })
      .state('assign', {
        url: '/assign',
        templateUrl: 'app/assign/assign.html',
        controller: 'AssignController',
        controllerAs: 'assign'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
