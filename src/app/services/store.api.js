(function() {
  'use strict';

  angular
    .module('adminAngular')
    .service('StoreApi', StoreApi);

  /** @ngInject */
  function StoreApi($http, $log, APISERVER, md5) {
    var headers = {'Conetent-Type': 'application/json'};

    this.list = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/assign/storeList',
        header: headers,
        data: {
          userId: obj.userId,
          status: obj.status == -1 ? null : +obj.status, // 状态0~4(未编辑，已编辑，未分配，组内未分配，已分配)
          capital: obj.provinceId == -1 ? null : +obj.provinceId,
          groupId: obj.orgId == -1 ? null : obj.orgId,
          memberId: obj.memberId == -1 ? null : obj.memberId,
          startTime: obj.startDate,
          endTime: obj.endDate,
          globalSearch: obj.searchStr,
          page: obj.currentPage || 1, // 当前页码
          pageCount: +obj.itemsPerPage  || 10 // 每页条数
        }
      });
    };

    this.detail = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER + '/assign/storeDetail/' + obj.id
      });
    };

    this.assignLog = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER + '/assign/assignLogs/' + obj.id
      });
    };

    this.remarkLog = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER + '/assign/remarkLog/' + obj.id
      });
    };

    this.update = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/assign/storeUpdate',
        header: headers,
        data: {
          storeId: obj.storeId,
          employeeCount: obj.employeeCount,   // 运营人数
          usersSource: obj.usersSource,  //主要用户来源
          monthlyRent: obj.monthlyRent,  // 店铺月租金
          phone: obj.phone,
          phone1: obj.phone1,   // 电话1
          phone2: obj.phone2,   // 电话2
          property: obj.property,  // 物业
          neighborhood: obj.neighborhood,   // 居委会
          chased: obj.chased,  // 城管
          imgGood: obj.imgGood,  // 图片是否美观(1:是，0：否)
          sortingGood: obj.sortingGood,  // 是否合理(1:是，0：否)
          hotGoods: obj.hotGoods,  // 热卖商品
          remark: obj.remark,  // 备注
          shopDate: obj.shopDate,  // 开店时间 2016-01-07 16:01:36.0
          businessName: obj.businessName,  // 店家名称
          shopName: obj.shopName,  // 店名
          // provinces: 北京市,  // 城市
          personNum: obj.idNo,  // 身份证
          payAlipayNum: obj.alipayAccount,  // 支付宝账号
          weixin: obj.wechat,  // 微信账号
          username: obj.username,  // 店铺账号
          detailAddress: obj.addr,
          operator:  obj.userId // 操作人ID
        }
      });
    };

    this.groupList = function(obj) {
      return $http({
        method: 'GET',
        url: APISERVER + '/assign/operations/group/list'
      });
    };

    this.groupDetail = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/assign/groupDetail',
        headers: headers,
        data: {
          orgId: obj.orgId,
          page: obj.currentPage || 1,
          pageCount: obj.itemsPerPage || 50
        }
      });
    };

    this.assign = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/assign/todo',
        headers: headers,
        data: {
          storeIds: obj.ids, // 店铺ID  list,
          operator: obj.userId, // 操作人ID
          groupId: obj.groupId, // 分组ID（必需）
          userId: obj.memberId, // 分配目标用户ID（分配到组不需要传递）
        }
      });
    };

    this.recover = function(obj) {
      return $http({
        method: 'POST',
        url: APISERVER + '/assign/recover',
        headers: headers,
        data: {
          storeId: obj.id, // 店铺ID  list,
          operator: obj.userId, // 操作人ID
        }
      });
    };

    $log.debug('StoreApi end');
  }
})();
