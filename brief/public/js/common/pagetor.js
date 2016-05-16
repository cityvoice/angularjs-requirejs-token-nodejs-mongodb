define(['angular'], function (angular) {
    return {
        name:"pagetor",
        type:"directive", 
        module:function(){
            return {
                restrict: 'EA',
                scope: {
                    conf: '='
                },        
            	replace:true,
            	template:'<ul class="pagination" ng-show="conf.totalPages > 0"><li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><a href="#">&laquo;</a></li>'+
            	'<li ng-repeat="n in conf.pageList" ng-click="selectPage(n)" ng-class="{active: n == conf.currentPage, separate: item == \'...\'}"><a href="#">{{n}}</a></li>'+
            	'<li ng-class="{disabled: conf.currentPage == conf.totalPages}" ng-click="nextPage()"><a href="#">&raquo;</a></li>'+
                '<li ng-show="conf.totalPages > 0" class="page-total">' +
                '每页{{conf.pageSize}}条'+
                '第<input type="text" ng-model="jumpPageNum" ng-change="jumpToPage()"/>页' +
                '每页<select class="" ng-model="conf.pageSize" ng-options="option for option in conf.pageOptions " ng-change="changePageOption()"></select>' +
                '条/共<strong>{{ conf.totalItems }}</strong>条</li>' +
                '</ul>'    	
            	,
                link: function( scope, element, attrs ) {
                	scope.selectPage = function(n){
                		scope.conf.currentPage = n;
                	};
                	scope.prevPage = function(){
                		scope.conf.currentPage -= 1;
                	};
                	scope.nextPage = function(){
                		scope.conf.currentPage += 1;
                	}; 
                	scope.jumpToPage = function(){
                       scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g,'');
                        if(scope.jumpPageNum !== ''){
                            scope.conf.currentPage = scope.jumpPageNum;
                        }
                	};
                    scope.changePageOption = function(){


                    };
                	scope.$watch(function(){
                        if(scope.conf.currentPage < 1){
                            scope.conf.currentPage = 1;
                        }

                        if(scope.conf.currentPage > scope.conf.totalPages){
                            scope.conf.currentPage = scope.conf.totalPages;
                        } 
                        scope.jumpPageNum = scope.conf.currentPage;   

                        var newValue = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';		
                		return newValue;

                	}, function(newCount, oldCount){
                		if(newCount == oldCount)return;  
                        scope.conf.onPageUpdate();    		
                	});

                	    	        	
                }
            }
        }
    }
})