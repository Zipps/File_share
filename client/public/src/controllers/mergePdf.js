angular.module('MyApp')
    .controller('MergePdfCtrl', function ($scope, $http, $routeParams, $location, $alert, $filter) {
        var fileList = [];
        $http({
            url: '/api/upload/' + $routeParams._id,
            method: 'GET'
        })
            .success(function(res) {
                $scope.files = res;
                $scope.pdfFiles = $filter('filter')($scope.files,{contentType: 'application/pdf'});
            })
            .error(function (err) {
                console.log(err);
            });

        $scope.uploadId = $routeParams._id;

        $scope.tooltips = {
            blankPage: {
                content: "Useful for printing double-sided, so that separate documents do not print on the same page."
            },
            titlePage: {
                content: "Add a title page separating each document that will display the filename."
            }
        };

        $scope.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {return true},
            itemMoved: function (event) {},
            orderChanged: function (event) {},
            containment: '#board'
        };

        $scope.mergeDownload = function(pdfFiles) {
            console.log("begin merge...");
            var mergeList = [];
            pdfFiles.forEach(function(file) {
                mergeList.push(file.key + '.pdf');
            });
            console.log('Merge list: ' + mergeList);
            $http({
                url: '/api/upload/' + $routeParams._id + '/merge',
                method: 'POST',
                data: mergeList
            })
                .success(function(res) {
                    $alert({
                        content: 'Merged all PDF\'s into "merged_doc.pdf"',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 5
                    });
                    console.log(res);
                    $location.path('/upload/' + $routeParams._id);
                })
                .error(function (err) {
                    console.log(err);
                });
        };
    });
