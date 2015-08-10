
angular.module('MyApp')
    .controller('ViewUploadCtrl', function ($scope, $http, $routeParams, $location, $alert) {
        $http({
            url: '/api/upload/' + $routeParams._id,
            method: 'GET'
        })
            .success(function(res) {
                console.log(res);
                $scope.files = res;
            })
            .error(function (err) {
                console.log(err);
            });
        $scope.uploadId = $routeParams._id;

        $scope.deleteFile = function(index) {
            $http({
                url: '/api/upload/' + $routeParams._id + '/file/' + $scope.files[index].key,
                method: 'DELETE'
            })
                .success(function() {
                    $alert({
                        content: 'Deleted ' + $scope.files[index].filename,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                    $scope.files.splice(index, 1);
                })
                .error(function (err) {
                    console.log(err);
                });
        };
        $scope.dropzoneConfig = {
            options: { // passed into Dropzone constructor
                url: '/api/upload/' + $routeParams._id + '/file/',
                dictDefaultMessage: '<b>Click</b> or <b>drop</b> files to upload.',
                maxFileSize: 1025,
                addRemoveLinks: false
            },
            'eventHandlers': {
                'sending': function (file, xhr, formData) {
                    console.log('sending')
                },
                'success': function (file, res) {
                    console.log('success');
                    $scope.$apply(function () {
                        $scope.files.push(res);
                    });
                },
                'error': function (file, res) {
                    $alert({
                        title: "Error!",
                        content: 'Unable to upload file.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 5
                    });
                    console.log(err);
                }
            }
        }
    });


