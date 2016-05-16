define(['angular'], function (angular) {

	return {
		name:"LoginController",
		type:"controller",
		module:["$scope", "LoginService", "$state", "$localStorage",function(scope, ls, state, $localStorage){
			scope.flag = 1;
			scope.loginName = "";
			scope.password = "";
			scope.errorMessage = "";
			scope.error = "";
			scope.inited = false;
			scope.signup = function(){
				if(!scope.loginName || !scope.password){
					scope.error = "error";
					scope.errorMessage = "请输入用户名和密码";
				}else{
					ls.signup({loginName:scope.loginName, password:scope.password}, function(res){
		                if (res.status) {
		                    $localStorage.myToken = res.token;

		                    state.go('admin.index.'+(res.data.role==1?'user':'brief'), {loginName:scope.loginName});
		                } else {
		                	scope.error = "error";
		                	scope.errorMessage = res.data;  
		                }
					})
				}
			};
			scope.signin = function(){
				if(!scope.loginName || !scope.password){
					scope.error = "error";
					scope.errorMessage = "请输入用户名和密码";
				}else{
					ls.signin({loginName:scope.loginName, password:scope.password}, function(res){
		                if (res.status) {
		                    $localStorage.myToken = res.token;
		                    state.go('admin.index.'+(res.data.role==1?'user':'brief'), {loginName:scope.loginName});
		                } else {
		                	scope.error = "error";
		                	scope.errorMessage = res.data;
		                    //alert(res.data)    
		                }
					})
				}
			};			
			scope.$watch("loginName+password", function(value){
				if(value){
					scope.error = "";
					scope.errorMessage = "";
				}else{
					if(!scope.inited)return;
					scope.error = "error";
					scope.errorMessage = "请输入用户名和密码";
				}
				scope.inited = true;
			});	
			scope.login = function(){
				scope.flag = 1;
			}			
			scope.register = function(){
				scope.flag = 0;
			}
		}]
	}
})
