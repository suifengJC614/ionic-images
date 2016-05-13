/**
 * Created by mac on 16/5/11.
 */
;(function($){

    var module = angular.module('ion-images');
    module.directive('imgGroup', ImageGroupDirective);

    ImageGroupDirective.$inject = ['imageModal']
    function ImageGroupDirective(imageModal){
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            scope:{
                col: "@"
            },
            template: '<ul class="row img-group" ng-transclude></ul>',
            controller: ['$scope', ImageGroupController],
            compile: function(element, attrs, transclude){
                return {
                    pre: ImageGroupPreLike,
                    post: ImageGroupPostLink
                }
            }
        }

        function ImageGroupPreLike(scope, element, attrs, ctrl){
            scope.images = [];
        }

        function ImageGroupPostLink(scope, element, attrs, ctrl, transclude){
            imageModal.createModal({images:scope.images}).then(function(modal){
                scope.modal = modal;
                scope.$watchCollection('images', function(){
                    modal.setImage(scope.images);
                })
            })
        }

        function ImageGroupController($scope){
            $scope.childs = [];

            this.compileChildImage = function(scope, element, attrs){
                var col = $scope.col;
                if(col > 5){
                    col = 5;
                }
                col = parseInt(col);
                var colWidth = "";
                if(col > 1){
                    colWidth = "col-" + parseInt(100 / col);
                }
                $(element).wrap("<li class='col "+colWidth+"'></li>");
                if(scope.bgSrc){
                    $scope.images.push(scope.bgSrc);
                }
                $scope.childs.push({
                    scope: scope,
                    element: element,
                    attrs: attrs
                })
                $(element).attr("data-index", $scope.childs.length - 1);
            }

            this.clickImageWrap = function(element){
                var index = $(element).attr("data-index");
                var opts = {
                    offset: $(element).offset()
                }
                $scope.modal.show(index, opts);
            }
        }
    }


})(jQuery);