(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('CallService', CallService);

  /** @ngInject */
  function CallService($http, $log, APISERVER, md5, utils) {
    var headers = {'Conetent-Type': 'application/json'};

    this.dial = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/callEngine/dial',
        header: headers,
        data: {
          destMobile: obj.destPhone,
          userId: obj.userId,
          wId: obj.taskId
        }
      });
    };

    this.hangup = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/callEngine/hangup',
        header: headers,
        data: {
          destMobile: obj.destPhone,
          userId: obj.userId
        }
      });
    };

    $log.debug('ApiService end');
    
  }
})();
