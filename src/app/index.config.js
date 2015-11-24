(function() {
  'use strict';

  angular
    .module('adminAngular')
    .config(config);

  /** @ngInject */
  function config($logProvider, localStorageServiceProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // storage config
    localStorageServiceProvider
      .setPrefix('YJS')
      .setStorageType('sessionStorage')
      .setNotify(true, true);

    // toastr config
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 2000;
    toastrConfig.positionClass = 'toast-top-center';
    toastrConfig.preventDuplicates = true;
    // toastrConfig.progressBar = true;
  }

})();
