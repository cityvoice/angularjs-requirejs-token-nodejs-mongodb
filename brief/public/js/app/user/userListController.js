 define(['angular'], function (angular) {
    return {
        name:"UserListController",
        type:"controller",
        module:["$scope", "UserService", '$stateParams', '$state', "$filter", function(scope, bs, $stateParams, $state, $filter){
            scope.loginName = $stateParams.loginName;
            scope.pageConfig = {
                currentPage : 1,
                pageSize : 5,
                pageList : 1,
                totalPages : 1,
                totalItems : 2,
                pageOptions: [5, 10, 20, 50],
                onPageUpdate : function(){
                    
                }
            }

            scope.$on('users.page', function( res ) {
                scope.users = bs.users;
                scope.pageConfig.totalItems = bs.records;
                scope.pageConfig.totalPages = Math.ceil(scope.pageConfig.totalItems/scope.pageConfig.pageSize);
                var rang = [];
                for(var i=1; i<=scope.pageConfig.totalPages; i++){
                    rang.push(i);
                }
                scope.pageConfig.pageList = rang;
            });   

            scope.$on('users.queryAll', function( event ) {
                bs.pageUser(scope.pageConfig);
            }); 
            scope.$on('users.modify', function( event ) {
                bs.pageUser(scope.pageConfig);
            });     
            scope.$on('users.delete', function( event ) {
                bs.pageUser(scope.pageConfig); 
            });     
            scope.$watch('pageConfig.currentPage+pageConfig.pageSize' , function(){
                bs.pageUser(scope.pageConfig);  
            });
            bs.getRole(function( res ){
                if(res.status){
                    scope.roles = res.data;
                }else{
                    alert(res.data)
                }
            });
        }]
    }
})