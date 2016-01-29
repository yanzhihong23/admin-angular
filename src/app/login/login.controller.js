(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, ApiService, UserService, toastr, $state) {
    var vm = this;

    vm.user = {
      // username: '18616725872',
      // password: 'zjdd1234',
      // username: '13764903755',
      // password: '123456'
      // username: '13681945800',
      // username: '13585679356',
    };

    vm.submit = submit;
    vm.logout = logout;

    function submit() {
      ApiService.login(vm.user).success(function(data) {
        $log.debug('controller');
        if(+data.flag === 1) {
          toastr.success('登录成功', 'Toastr fun!');

          var info = data.data;
          vm.user.password = null;
          vm.user.isLeader = info.isLeader === '1';
          vm.user.realName = info.username;
          vm.user.orgId = info.orgid;
          vm.user.roleId = info.roleid;
          vm.user.uId = info.uid;
          vm.user.rights = {
            assign: info.allotAuth,
            recycle: info.recoverAuth,
            input: info.enterAuth,
            autoAssign: info.autoAllotAuth,
            report: !!info.viewReportAuth
          };

          // save user info
          UserService.setUser(vm.user);
          $log.debug(vm.user);

          switch(info.roleid) {
            case 5:
            case 9:
            case 10:
              $state.go('store.list');
              break;
            case 4:
              $state.go('finance.list');
              break;
            default:
              $state.go('task.list');
          }

        } else {
          toastr.error('用户名或密码错误', 'Error');
        }
      });
    }

    function logout() {
      $log.debug('logout');
    }
  }
})();
