(function() {
  'use strict';

  angular
    .module('adminAngular')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($log, ApiService, UserService, toastr, $state) {
    var vm = this;

    vm.user = {
      username: '18616725872',
      password: 'zjdd1234',
      // username: '13764903755',
      // password: '123456'
    };

    vm.submit = submit;
    vm.logout = logout;

    function submit() {
      ApiService.login(vm.user).success(function(data) {
        $log.debug('controller');
        if(+data.flag === 1) {
          toastr.success('登录成功', 'Toastr fun!');

          var info = data.data;
          vm.user.isLeader = info.isLeader === '1';
          vm.user.realName = info.username;
          vm.user.orgId = info.orgid;
          vm.user.roleId = info.roleid;
          vm.user.uId = info.uid;
          // save user info
          UserService.setUser(vm.user);

          $state.go('task.list');

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
