define(['angular'], function (angular) {

	return {
		name:"AdminController",
		type:"controller",
		module:["$scope", "AdminService", "$state", "$localStorage","$stateParams", function(scope, AdminService, state, $localStorage,stateParams){
			scope.date = new Date;
			scope.loginName = state.current.data.loginName;
			scope.token = $localStorage.token;
			scope.isAdmin = state.current.data.role == 1 ? true : false;
			scope.logout = function(){
	           AdminService.logout(function() {
	                state.go('login');
	            }, function() {
	                alert("Failed to logout!");
	            });
			}		
		}]
	}
})
