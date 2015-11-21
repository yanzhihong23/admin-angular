(function() {
  'use strict';

  angular
    .module('adminAngular')
    .filter('city', city)
    .filter('status', status)
    .filter('coType', coType);

  /** @ngInject */
  function city() {
    var map = {
      '11': '大客户',
      '12': '北京',
      '13': '宁波',
      '14': '南京',
      '15': '苏州',
      '16': '广州',
      '17': '杭州',
      '18': '深圳',
      '19': '武汉',
      '20': '天津',
      '21': '上海'
    };

    return function(id) {
      return map[id] || '-';
    };
  }

  function status() {
    var map = {
      '01': '无组未分配',
      '02': '组内未分配',
      '03': '未处理',
      '04': '跟进中',
      '05': '有效',
      '06': '无效',
    };

    return function(id) {
      return map[id] || '-';
    };
  }

  function coType() {
    var map = {
      '1': '经销商',
      '2': '小店'
    };

    return function(id) {
      return map[id] || '-';
    };
  }
})();
