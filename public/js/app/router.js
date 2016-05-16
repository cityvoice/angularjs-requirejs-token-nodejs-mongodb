define(['angular', 'require', 'angular-ui-router', 'angular-storage'], function (angular, require) {
    var app = angular.module('webapp', ['ui.router','ngStorage']);
    app.config(['$stateProvider', '$urlRouterProvider', '$provide','$controllerProvider', '$compileProvider', '$filterProvider',
        function($stateProvider,$urlRouterProvider,$provide,$controllerProvider,$compileProvider,$filterProvider) {
            var  provide = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };
            var asyncLoad = function(config){
                return ["$q", function($q){
                    var deferred = $q.defer();
                    var js = [];
                    angular.forEach(config.files, function(value, key) {
                        value = (config.base||"") + value;
                        this.push(value);
                    }, js);

                    require(js, function () {
                        for(var i=0;i<arguments.length;i++){
                            if(provide[arguments[i].type]){
                                provide[arguments[i].type](arguments[i].name, arguments[i].module); 
                            }
                        }
                        deferred.resolve();
                    });
                    return deferred.promise;   
                }]

            }
            $urlRouterProvider.otherwise('/login');
            $stateProvider.            
                state('login',{
                    url: '/login',
                    templateUrl: '/templates/login.html',
                    resolve:{
                        load : asyncLoad({base:"/js/app/login/",files:['loginService.js', 'loginController.js']})
                    }
                }).
                state('error',{
                    url: '/error',
                    templateUrl: '/templates/error.html'
                }).
                state('forbidden',{
                    url: '/forbidden',
                    templateUrl: '/templates/forbidden.html'
                }).
                state('logout',{
                    url: '/logout',
                    templateUrl: '/templates/login.html',
                    resolve:{
                        load : asyncLoad({base:"/js/app/admin/",files:['adminService.js', 'adminController.js']})
                    }
                }).              
                state('admin',{
                    url: '/admin',
                    abstract: true,
                    templateUrl: '/templates/admin.html',
                    resolve:{
                        load : asyncLoad({base:"/js/app/admin/",files:['adminService.js', 'adminController.js']})
                    }
                }).
                state('admin.index',{
                    url: '/index',
                    abstract: true,
                    templateUrl: '/templates/adminIndex.html',
                    authenticate:1
                }). 
                state('admin.index.role',{
                    url: '/role',
                    views:{
                        'main':{templateUrl: '/templates/role.html'}
                    },
                    resolve:{
                        load : asyncLoad({base:"/js/app/role/",files:['roleService.js', 'roleController.js']})
                    },
                    authenticate:1,
                    admin:1
                }).
                state('admin.index.user',{
                    url: '/user',
                    views:{
                        'main':{templateUrl: '/templates/user.html'}
                    },
                    resolve:{
                        load : asyncLoad({base:"/js/app/user/",files:['userService.js', 'userListController.js','userEditController.js','deleteUserDirective.js','editUserDirective.js','rowSelectDirective.js','../../common/pagetor.js']})
                    },
                    authenticate:1,
                    admin:1
                }).
                state('admin.index.brief',{
                    url: '/brief',
                    views:{
                        'main':{templateUrl: '/templates/brief.html'}
                    },
                    authenticate:1
                })
    }]);   
    app.factory("tokenInjector", [ '$localStorage', '$location', '$q', '$injector',function($localStorage, $location, $q, $injector) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.myToken) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.myToken;
                }
                return config;
            },
            'responseError': function(res) {
                if(res.status === 401 || res.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(res);
            }
        };
    }]);   
    app.filter("roleFilter", function(){
        return function(input, roleId) { 
            for(var i=0;i<input.length;i++){
                if(input[i].roleId == roleId)return input[i].desc;
            }
            return "";
        }
        
    })
    app.filter("myDate", function(){
        return function(input, format) { 
            var output = "";
            var patterns = {   
                "M+" : input.getMonth()+1,                 //月份   
                "d+" : input.getDate(),                    //日   
                "h+" : input.getHours(),                   //小时   
                "m+" : input.getMinutes(),                 //分   
                "s+" : input.getSeconds(),                 //秒    
                "S"  : input.getMilliseconds()             //毫秒   
            };
            var week = ["日","一","二","三","四","五","六"];
            if(/(y+)/.test(format)){
                format = format.replace(RegExp.$1, (input.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(W+)/.test(format)){
                format = format.replace(RegExp.$1, (RegExp.$1.length==1 ? '周':'星期')+week[input.getDay()]);
            }   
            for(var item in patterns){
                if(new RegExp("("+ item +")").test(format)){
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? patterns[item] : ("00"+ patterns[item]).substr((""+patterns[item]).length));

                }
            }
            return format; 
        }
        
    })    
    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.transformRequest = function(obj){  
        var str = [];  
        for(var p in obj){  
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
        }  
            return str.join("&");  
        }  
        $httpProvider.defaults.headers.post = {  
            'Content-Type': 'application/x-www-form-urlencoded'  
        } 
        $httpProvider.interceptors.push('tokenInjector');
    }]);  

    app.run(["$rootScope", "$location", '$localStorage', function($rootScope, $location, $localStorage){
        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }
        function getUserFromToken() {
            var token = $localStorage.myToken;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }          
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            var user = getUserFromToken();
            toState.data = {loginName:user.loginName, role:user.role};
            if(toState && toState.authenticate && !$localStorage.myToken){
                $location.path('/login');
            }else{
                if(toState && toState.admin && $localStorage.myToken){
                    if(user.role != 1){
                        location = "/forbidden";
                        //$location.path('/forbidden');
                    }    
                }
            }
        })
        
    }]) 


    return app;
});