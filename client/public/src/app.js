angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'xeditable', 'dropzone', 'ui.sortable'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'src/views/main.html',
                controller: 'CreateUploadCtrl'
            })
            .when('/upload/:_id', {
                templateUrl: 'src/views/uploadFile.html',
                controller: 'ViewUploadCtrl'
            })
            .when('/upload/:_id/merge', {
                templateUrl: 'src/views/mergePdf.html',
                controller: 'MergePdfCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })

