define(['angular'], function (angular) {
	return  {
		name:"LoginService",
		type:"service",
		module:['$rootScope', '$http', function(rootScope, http){
			var service = {
				notify:function(name){
					rootScope.$broadcast(name);
				},		
				signup : function(data, success, error){
					http.post('/signup', {"loginName":data.loginName,"password":data.password}).success(success).error(error)
				},		
				signin : function(data, success, error){
					http.post('/signin', {"loginName":data.loginName,"password":data.password}).success(success).error(error)
				}
			}
			return service;
		}]
	}
})