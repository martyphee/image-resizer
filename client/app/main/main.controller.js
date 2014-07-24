'use strict';

angular.module('angularFullstack20App')
    .controller('MainCtrl', function ($scope, $http, socket, $modal) {
        $scope.awesomeThings = [];

        $http.get('/api/things').success(function (awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.addThing = function () {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function (thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });

        $scope.onShowModal = function() {
            var ModalInstanceCtrl = function ($scope, $modalInstance) {
                $scope.content = {
                    text: "Hello World"
                }
            };

            var modalInstance = $modal.open({
                backdrop: 'static',
                windowClass: 'ce-settings-popup',
                templateUrl: 'app/main/popup.html',
                controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function (result) {
                if (result && result !== 'cancel') {
                    angular.copy(result, $scope.content);
                }
            }, function () {
            });

        }
    });