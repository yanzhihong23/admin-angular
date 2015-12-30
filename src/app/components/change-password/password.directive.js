(function() {
  'use strict';

  angular
    .module('adminAngular')
    .directive('changePassword', changePassword);

  /** @ngInject */
  function changePassword($uibModal) {
    var directive = {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attr) {
        // bind event
        element.bind('click', function() {
          $uibModal.open({
            animation: true,
            templateUrl: 'app/components/change-password/password.modal.html',
            controller: function(ApiService, UserService, toastr, $rootScope, $uibModalInstance) {
              var vm = this, user = UserService.getUser();

              vm.pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;

              vm.user = {
                userId: user.uId
              };

              vm.submit = submit;
              vm.cancel = cancel;

              function submit() {
                ApiService.changePassword(vm.user).success(function(data) {
                  if(+data.flag === 1) {
                    toastr.success('密码修改成功', '请重新登录!');
                    $uibModalInstance.dismiss('success');

                    $rootScope.logout();
                  } else {
                    toastr.error(data.msg);
                  }
                });
              }

              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
            },
            controllerAs: 'pwd',
            size: '', // lg, sm
          });
        });
      }
    };

    return directive;
  }

})();