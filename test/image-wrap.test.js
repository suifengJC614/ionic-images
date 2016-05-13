/**
 * Created by mac on 16/5/11.
 */
(function () {
    var module = angular.module('app', ["ionic", "ion-images"]);
    module.controller('TestImageWrapCtrl', TestImageWrapController);

    TestImageWrapController.$inject = ['$scope'];
    function TestImageWrapController($scope, $ionicModal) {
        $scope.images = [
            'test/img/ben.png',
            'test/img/ben.png',
            'test/img/ben.png',
            'test/img/max.png',
            'test/img/ben.png'
        ];
    }
})()