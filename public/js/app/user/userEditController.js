 define(['angular'], function (angular) {
    return {
        name:"UserEditController",
        type:"controller",       
        module:["$scope", "UserService", function(scope, bs){
            scope.$on('users.edit', function(  ) {
                scope.id = bs.currentUser._id;
                scope.loginName = bs.currentUser.loginName;
                scope.role = bs.currentUser.role;
                scope.realName = bs.currentUser.realName;
                scope.show = true;
                scope.$apply();
            });     
            scope.show = false;
            scope.id = "";
            scope.loginName = "";
            scope.role = "";
            scope.realName = "";
            scope.save = function(){
                if(!scope.id)return;
                var user = {"id":scope.id, "role":scope.role, "realName":scope.realName};
                bs.modifyUser(user);    
                scope.cancel();
            };
            scope.cancel = function(){
                scope.show = false;
            };
            scope.onPageUpdate = function(){
                bs.pageUser(scope.pageConfig); 
            }
        }]
    }
});