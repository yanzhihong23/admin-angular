(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('ApiService', ApiService);

  /** @ngInject */
  function ApiService($http, $log, APISERVER, md5, utils) {
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

    this.getDataList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/dataList',
        header: headers,
        data: {
          khly: obj.customerSource, // 客户来源
          hzlx: obj.cooperationType, // 合作类型 1: 经销商, 2: 小店
          cs: obj.cityId, // 城市
          zt: obj.status, // 状态
          dtlsts: obj.subStatus,
          uid: obj.username, // 用户ID
          page: obj.pageIndex || 1, // 当前页码
          pageCount: obj.pageSize || 15 // 每页条数
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
          dtlsts: obj.status, // 状态
          remark: obj.remark,
          cgroup: obj.group // 所属组
        }
      });
    };

    this.groupList = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/query/groupList',
        header: headers,
        data: {
          uid: obj.username,
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
          orgid: obj.orgId
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
          uid: obj.userId
        }
      });
    };

    $log.debug('ApiService end');
    
  }
})();
