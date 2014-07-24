'use strict';

angular.module('angularFullstack20App')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editor', {
                url: '/editor',
                templateUrl: 'app/editor/editor.html',
                controller: 'ImageEditorCtrl',
                controllerAs: 'vm'
            });
    });