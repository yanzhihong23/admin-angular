(function() {
  'use strict';

  angular
    .module('adminAngular')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('task', {
        url: '/task',
        abstract: true,
        templateUrl: 'app/task/task.html',
        controller: 'TaskController',
        controllerAs: 'task'
      })
      .state('task.list', {
        url: '/list?back',
        views: {
          'task': {
            templateUrl: 'app/list/list.html',
            controller: 'ListController',
            controllerAs: 'list'
          }
        }
      })
      .state('task.detail', {
        url: '/detail?index',
        views: {
          'task': {
            templateUrl: 'app/detail/detail.html',
            controller: 'DetailController',
            controllerAs: 'detail'
          }
        }
      })
      .state('task.assign', {
        url: '/assign?id',
        views: {
          'task': {
            templateUrl: 'app/assign/assign.html',
            controller: 'AssignController',
            controllerAs: 'assign'
          }
        }
      })
      .state('task.input', {
        url: '/input',
        views: {
          'task': {
            templateUrl: 'app/input/input.html',
            controller: 'InputController',
            controllerAs: 'input'
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
