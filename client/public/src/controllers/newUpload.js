angular.module('MyApp')
    .controller('CreateUploadCtrl', function ($scope, $http, $alert, $location) {
        $scope.createContainer = function() {
            $http({
                url: '/api/upload/',
                method: 'POST'
            })
                .success(function(res) {
                    $location.path('/upload/' + res._id);
                })
                .error(function(err) {
                   console.log(err);
                });
        };
    });
