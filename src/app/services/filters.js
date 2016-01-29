(function() {
  'use strict';

  angular
    .module('adminAngular')
    .filter('abs', abs)
    .filter('city', city)
    .filter('team', team)
    .filter('status', status)
    .filter('storeStatus', storeStatus)
    .filter('coType', coType)
    .filter('role', role)
    .filter('remark', remark)
    .filter('trustUrl', trustUrl)
    .filter('phoneEncrypt', phoneEncrypt)
    ;

  /** @ngInject */
  function abs() {
    return function(num) {
      return Math.abs(num);
    }
  }

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

  function status(StatusService) {
    var map = StatusService.getStatusMap();
    // map['-1'] = '全部';

    return function(id) {
      return map[id] || '-';
    };
  }

  function storeStatus() {
    var map = {
      '-1': '全部',
      '0': '未编辑',
      '1': '已编辑',
      '2': '未分配',
      '3': '组内未分配',
      '4': '已分配'
    };

    return function(id) {
      return map[id] || '-';
    };
  }

  function coType() {
    var map = {
      '-1': '全部',
      '1': '经销商',
      '2': '小店'
    };

    return function(id) {
      return map[id] || '-';
    };
  }

  function role() {
    var map = {
      '0': '管理员',
      '1': '城市CEO',
      '2': '销售主管',
      '3': '销售',
      '4': '财务',
      '5': '运营专员',
      '9': '运营总监',
      '10': '运营主管'
    };

    return function(id) {
      return map[id];
    }
  }

  function team() {
    var map = {
      '111': '大客户A',
      '112': '大客户B',
      '113': '大客户C',
      '114': '大客户D',
      '121': '北京A',
      '122': '北京B',
      '131': '宁波A',
      '132': '宁波B',
      '141': '南京A',
      '151': '苏州A',
      '161': '广州A',
      '162': '广州B',
      '163': '广州C',
      '171': '杭州A',
      '172': '杭州B',
      '181': '深圳A',
      '182': '深圳B',
      '183': '深圳C',
      '184': '深圳D',
      '191': '武汉A',
      '192': '武汉B',
      '193': '武汉C',
      '201': '天津A',
      '211': '上海A',
      '212': '上海B',
      '213': '上海C',
      '214': '上海D',
      '215': '上海E'
    }

    return function(id) {
      return map[id] || '-';
    };
  }


  function remark() {
    return function(str) {
      if(str && str.length > 30) {
        return str.substr(0, 30) + '...';
      } else {
        return str;
      }
    };
  }

  function trustUrl($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

  function phoneEncrypt() {
    return function(str) {
      if(str.length === 11) {
        return str.substr(0,3) + '****' + str.substr(7);
      } else {
        return str;
      }
    };
  }
})();
