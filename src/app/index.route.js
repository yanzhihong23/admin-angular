(function() {
  'use strict';

  angular
    .module('adminAngular')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      // saleman
      .state('task', {
        url: '/task',
        abstract: true,
        templateUrl: 'app/task/task.html',
        controller: 'TaskController',
        controllerAs: 'task'
      })
      .state('task.list', {
        url: '/list',
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
      .state('task.auto', {
        url: '/auto',
        views: {
          'task': {
            templateUrl: 'app/assign/assign.html',
            controller: 'AssignController',
            controllerAs: 'assign'
          }
        }
      })
      .state('task.report', {
        url: '/report',
        views: {
          'task': {
            templateUrl: 'app/report/report.html',
            controller: 'ReportController',
            controllerAs: 'report'
          }
        }
      })
      // operater
      .state('store', {
        url: '/store',
        abstract: true,
        templateUrl: 'app/store/store.html',
        controller: 'StoreController',
        controllerAs: 'store'
      })
      .state('store.list', {
        url: '/list',
        views: {
          'store': {
            templateUrl: 'app/store/list/list.html',
            controller: 'StoreListController',
            controllerAs: 'list'
          }
        }
      })
      .state('store.detail', {
        url: '/detail/:id',
        views: {
          'store': {
            templateUrl: 'app/store/detail/detail.html',
            controller: 'StoreDetailController',
            controllerAs: 'detail'
          }
        }
      })
      .state('store.assign', {
        url: '/assign/:id',
        views: {
          'store': {
            templateUrl: 'app/store/assign/assign.html',
            controller: 'StoreAssignController',
            controllerAs: 'assign'
          }
        }
      })
      ;

    $urlRouterProvider.otherwise('/login');
  }

})();
