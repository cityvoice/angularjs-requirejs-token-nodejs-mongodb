define(['angular'], function (angular) {
	return  {
		name:"AdminService",
		type:"service",
		module:['$rootScope', '$http', '$localStorage',function(rootScope, $http, $localStorage){
			var service = {	
				logout : function(success, error){
					delete $localStorage.myToken;
					success();
				}

			}
			return service;
		}]
	}
})