angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'ngSanitize', 'mgcrea.ngStrap', 'xeditable', 'dropzone'])
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
            .otherwise({
                redirectTo: '/'
            });
    })

