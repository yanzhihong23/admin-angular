(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('ApiService', ApiService);

  /** @ngInject */
  function ApiService($http, $log, APISERVER, md5) {
    var headers = {'Conetent-Type': 'application/json'};

    this.login = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/login',
        header: headers,
        data: {
          uid: obj.username,
          passwd: md5.createHash(obj.password)
        }
      });
    };

    this.getStatusList = function() {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/statusType'
      });
    };

    this.getDataList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/dataList',
        header: headers,
        data: {
          khly: obj.customerSource, // 客户来源
          hzlx: obj.coType, // 合作类型 1: 经销商, 2: 小店
          cs: obj.cityId, // 城市
          statusType: obj.status, // 状态
          // dtlsts: obj.subStatus,
          searchStr: obj.searchStr,
          uid: obj.uId, // 用户ID
          page: obj.currentPage || 1, // 当前页码
          pageCount: obj.itemsPerPage  || 10 // 每页条数
        }
      });
    };

    this.updateData = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/updateData',
        header: headers,
        data: {
          id: obj.taskId, 
          name: obj.name,
          phone: obj.phone,
          wx: obj.wechat,
          qq: obj.qq,
          ccity: obj.cityId,
          custype: obj.customerType, // 客户类型
          // lb: obj.category // 类别
          // dtlsts: obj.status, // 状态
          statusType: obj.status,
          remark: obj.remark,
          cgroup: obj.group, // 所属组
          userId: obj.userId
        }
      });
    };

    this.groupList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/groupList',
        header: headers,
        data: {
          uid: obj.uId,
          urole: obj.roleId
        }
      });
    };

    this.memberList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/userList',
        header: headers,
        data: {
          orgid: obj.orgId
        }
      });
    };

    this.assignToTeam = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/dispatchGroupWork',
        header: headers,
        data: {
          wid: obj.taskId,
          orgid: obj.orgId,
          userId: obj.userId
        }
      });
    };

    this.assignToMember = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/dispatchPersonWork',
        header: headers,
        data: {
          wid: obj.taskId,
          uid: obj.uId,
          userId: obj.userId
        }
      });
    };

    this.assignHistory = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/dispatchDetail',
        header: headers,
        data: {
          wId: obj.taskId
        }
      });
    };

    this.statusHistory = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/statusLog',
        header: headers,
        data: {
          wId: obj.taskId
        }
      });
    };

    this.remarkHistory = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/remarkLog',
        header: headers,
        data: {
          wId: obj.taskId
        }
      });
    };



    $log.debug('ApiService end');
    
  }
})();
