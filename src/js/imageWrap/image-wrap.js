/**
 * Created by mac on 16/5/11.
 */
(function($){

    var module = angular.module('ion-images');
    module.directive('imgWrap', ImageWrapDirective);

    function ImageWrapDirective(){
        return {
            restrict: "E",
            replace: true,
            require : '^?imgGroup',
            scope:{
                delegateHandle: "@",
                bgSrc: "=",
                defAddClass: "@",
                onClickWrap: "&"
            },
            template: '<div class="col-img-wrap"><div></div><em></em></div>',
            compile: function (element, attrs) {
                $(element).find('div').attr({
                    'ng-class': "{'"+(attrs.defAddClass?attrs.defAddClass:'def-add')+"': !bgSrc && onClickWrap}",
                    'ng-click': "clickWrap()"
                });
                return ImageWrapLink;
            }
        }

        function ImageWrapLink(scope, element, attrs, imgGroupCtrl){
            var $wrap = $(element).find("div");
            if(imgGroupCtrl){
                imgGroupCtrl.compileChildImage(scope, element, attrs);
            }
            var updateImage = function(){
                if(scope.bgSrc) {
                    $wrap.css("background-image", "url('" + scope.bgSrc + "')");
                }else{
                    $wrap.css("background-image", "");
                }
            }

            scope.clickWrap = function(){
                if(imgGroupCtrl){
                    imgGroupCtrl.clickImageWrap(element);
                }
                if(typeof scope.onClickWrap == "function"){
                    scope.onClickWrap();
                }
            }

            scope.$watch(scope.bgSrc, updateImage);
        }
    }

})(jQuery)