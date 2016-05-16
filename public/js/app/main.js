'use strict';

(function (win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,
        paths: {
            'router': '../app/router',
            'underscore': 'underscore.min',
            'angular': 'angular.min',
            'angular-storage': 'ngStorage.min',
            'angular-ui-router': 'angular-ui-router.min'
        },
        shim: {
            'underscore': {
                exports: '_'
            },
            'angular': {
                exports: 'angular'
            },
            'angular-ui-router': {
                deps: ['angular'],
                exports: 'ngUIRouter'
            },
            'angular-storage': {
                deps: ['angular'], 
                exports: 'ngStorage'
            }
        }
    };

    require.config(config);

    require(['angular', 'router'], function(angular){
        angular.bootstrap(document, ['webapp']);
    });

})(window);