/**
 * Created by martinphee on 7/22/14.
 */

(function() {
    'use strict';

    var viewPortWidth = 540;
    var viewPortHeight = 335;

    function ImageSizerCtrl($scope, $element, $attrs) {
        var vm = this;

        vm._options = angular.extend({}, $scope.$eval($attrs.ceImageSizer));

        console.log(vm._options);
        vm._scope = $scope;
        vm._element = $element;
        vm._attrs = $attrs;

        vm._vpElm = '#image-viewport';

        vm._imageElm = new Image();
        vm._imageElm.src = vm._options.isImgUrl;
        vm._imageElm.onload = _.bind(vm._imageLoaded, vm);

        var timeoutId = 0;
        $('div.resize').mousedown(function(event) {
            var target = event.currentTarget.dataset["method"];
            timeoutId = setInterval(_.bind(vm[target], vm), 100);
        }).bind('mouseup mouseleave', function(event) {
            clearInterval(timeoutId);
        });

        var viewPort = $element.find(vm._vpElm);
        viewPort.bind('mouseup', function(e) {
            viewPort.unbind('mousemove');
        });

        viewPort.bind('mousedown', function(e) {
            e.stopPropagation(true);
            var lastMouseX = e.pageX;
            var lastMouseY = e.pageY;
            viewPort.bind('mousemove', function(e) {
                var currMouseX = e.pageX; //event.offsetX;
                var currMouseY = e.pageY; //event.offsetY;

                var deltaX = currMouseX - lastMouseX;
                var deltaY = currMouseY - lastMouseY;

                vm._imageMetrics.left = vm._imageMetrics.left + deltaX;
                vm._imageMetrics.top = vm._imageMetrics.top + deltaY;

                vm._position();

                lastMouseX = currMouseX;
                lastMouseY = currMouseY;
            });
        });

        $scope.$on('destroy', function() {
            $element.find(vm._vpElm).unbind('mousedown')
        });
    }

    ImageSizerCtrl.$inject = ['$scope', '$element', '$attrs'];

    ImageSizerCtrl.prototype._imageLoaded = function(event) {
        console.log(event);

        this._imageOrigMetrics = {
            width: this._imageElm.width,
            height: this._imageElm.height,
            top: 0,
            left: 0,
            isCentered: true
        };

        this._imageMetrics = angular.copy(this._imageOrigMetrics);

        this._imageContorls = {
            canvas: document.createElement('canvas')
        };

        this._imageContorls.context = this._imageContorls.canvas.getContext("2d");

        this._imageContorls.canvas.width = this._imageElm.width;
        this._imageContorls.canvas.height = this._imageElm.height;
        this._imageContorls.context.drawImage(this._imageElm, 0, 0);
        this.center();
    };

    ImageSizerCtrl.prototype._render = function() {
        this._imageContorls.context.drawImage(this._imageElm,
            0,
            0,
            this._imageMetrics.width,
            this._imageMetrics.height);

        this._element.find(this._vpElm).css("background-image", 'url(' +  this._imageContorls.canvas.toDataURL("image/jpeg") + ')');
    };

    ImageSizerCtrl.prototype.reset = function() {
        this._imageMetrics = angular.copy(this._imageOrigMetrics);

        this._render();
        this.center();
    };

    /**
     * viewPortWidth
     * viewPortHeight
     *
     * @private
     */
    ImageSizerCtrl.prototype.center = function() {
        this._imageMetrics.left = (viewPortWidth - this._imageMetrics.width)/2;
        this._imageMetrics.top = (viewPortHeight - this._imageMetrics.height)/2;

        this._element.find(this._vpElm).css("background-position", this._imageMetrics.left + "px " + this._imageMetrics.top + "px ")
        this._imageMetrics.isCentered = true;
    };

    ImageSizerCtrl.prototype._resize = function(delta) {
        var height = this._imageMetrics.height;

        this._imageMetrics.height = this._imageMetrics.height + delta;
        this._imageMetrics.width = (this._imageMetrics.width * this._imageMetrics.height) / height;

        console.log("Height: " + this._imageMetrics.height + ", Width: " + this._imageMetrics.width);

        this._render();
        if( this._imageMetrics.isCentered ) {
            this.center();
        }
    };

    ImageSizerCtrl.prototype._position = function() {
        this._imageMetrics.isCentered = false;

        this._element.find(this._vpElm).css("background-position", this._imageMetrics.left + "px " + this._imageMetrics.top + "px ")
    };

    ImageSizerCtrl.prototype.expand = function() {
        this._resize(10);
    };

    ImageSizerCtrl.prototype.compress = function () {
        this._resize(-10);
    };

    ImageSizerCtrl.prototype.moveUp = function() {
        this._position(--this._imageMetrics.top, 0);
    };

    ImageSizerCtrl.prototype.moveDown = function() {
        this._position(++this._imageMetrics.top, 0);
    };

    ImageSizerCtrl.prototype.moveLeft = function() {
        this._position(0, --this._imageMetrics.left);
    };

    ImageSizerCtrl.prototype.moveRight = function() {
        this._position(0, ++this._imageMetrics.left);
    };

//    ImageSizerCtrl.prototype._base64img = function(image){
//        this._imageContorls = {
//            canvas: document.createElement('canvas')
//        };
//        this._imageContorls.context = this._imageContorls.canvas.getContext("2d");
//        this._imageContorls.canvas.width = image.width;
//        this._imageContorls.canvas.height = image.height;
//        this._imageContorls.context.drawImage(image, 0, 0);
//        var blob = this._imageContorls.canvas.toDataURL("image/png");
//        return blob.replace(/^data:image\/(png|jpg);base64,/, "");
//    };


    angular.module('angularFullstack20App')
        .directive('ceImageSizer', [ function() {
            return {
                restrict: 'AC',
                scope: {
                    isImgUrl: '='
                },
                replace: false,
                templateUrl: 'app/editor/imageSizer.html',
                controller: 'ImageSizerCtrl',
                controllerAs: 'vm',
                template: '',
                link: function($scope, $element, $attrs) {

                }
            }
        }]);

    angular.module('angularFullstack20App')
        .controller('ImageSizerCtrl', ImageSizerCtrl);
})();