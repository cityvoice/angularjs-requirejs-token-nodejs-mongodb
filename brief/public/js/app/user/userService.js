define(['angular'], function (angular) {
	return {
		name:"UserService",
		type:"service",
		module: ['$rootScope', '$http', function(rootScope, http) {
			var service = {
				notify:function(name){
					rootScope.$broadcast(name);
				},
				index:-1,
				users:[],
				records : 0,
				currentUser:null,
				saveUser : function(user){
					http.post('/signin',{"loginName":user.loginName,"realName":user.realName,"role":user.role})
					.success(function(res) {
						if(res.status){
							//service.users.push({"loginName":user.loginName, "realName":user.realName, "role":user.role, "roleDesc":user.roleDesc});
							service.notify("users.queryAll");
						}
					})

				},
				deleteUser : function(user){
					http.post("/delete", {"id":user._id,"loginName":user.loginName})
					.success(function(res) {
						if(res.status){
							service.notify("users.delete");
						}
					})
				},		
				modifyUser : function(user){
					http.post('/modify',{"id":user.id,"loginName":user.loginName,"realName":user.realName,"role":user.role})
					.success(function(res) {
						if(res.status){
							service.notify("users.modify");
						}
					})

				},		
				pageUser : function(config){
					http.post('/pageUser', {cp:config.currentPage, ps:config.pageSize})
					.success(function(res) {
						if(res.status){
							service.users = res.data.users;
							service.records = res.data.records;
							service.notify("users.page");
						}
					})
				},	
				getRole : function(success, error){
					http.get("/role").success(success).error(error)
				},	
				getRoleById : function(roleId){
					for(var i=0,len=service.roles.length;i<len;i++){
						if(service.roles[i].roleId == roleId){
							return service.roles[i];
						}
					}
					return {};
				},					
				edit : function(user){
					service.currentUser = user;
					service.notify("users.edit");
				}
			}
			return service;
		}]
	}
})