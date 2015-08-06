angular.module('MyApp')
    .filter('toMB', function () {
        return function (bytes) {
            if (bytes < 1000000) {
                return (Math.round(bytes / 1024 * 100) / 100) + " KB"
            }

            var mb = bytes / 1024 / 1024;
            mb = Math.round(mb * 100) / 100;
            return mb + " MB"
        }
    })
    .filter('fromNow', function () {
        return function (date) {
            return moment(date).fromNow();
        }
    });