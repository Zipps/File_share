angular.module('MyApp')
    .controller('MergePdfCtrl', function ($scope, $http, $routeParams, $location, $alert) {
        $http({
            url: '/api/upload/' + $routeParams._id,
            method: 'GET'
        })
            .success(function(res) {
                console.log(res);
                $scope.pdfFiles = res;
            })
            .error(function (err) {
                console.log(err);
            });
        $scope.uploadId = $routeParams._id;

        $scope.list = [1,2,3,4,5,6,7];

        $scope.mergeDownload = function() {
            console.log("begin merge...");
            $http({
                url: '/api/upload/' + $routeParams._id + '/merge',
                method: 'POST'
            })
                .success(function(res) {
                    $alert({
                        content: 'Merged all PDF\'s into "merged_doc.pdf"',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 5
                    });
                    console.log(res);
                    $scope.files.push(res);
                    $location.path('/upload/' + $routeParams._id);
                })
                .error(function (err) {
                    console.log(err);
                });
        };
    });
