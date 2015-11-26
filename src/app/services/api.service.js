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
          zt: obj.status, // 状态
          dtlsts: obj.subStatus,
          searchStr: obj.searchStr,
          uid: obj.uId, // 用户ID
          page: obj.pageIndex || 1, // 当前页码
          pageCount: obj.pageSize || 10 // 每页条数
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

    this.call = function(obj) {
      return $http({
        method: 'JSONP',
        url: 'http://192.168.100.20:8080/ec2/callengine/http/operation?json={%22dest%22:%2213918320423%22,%22ext_field%22:%22%22,%22command%22:%22dial%22,%20%22src%22:%2210086%22}'
      })
    };

    $log.debug('ApiService end');
    
  }
})();
