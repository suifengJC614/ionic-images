/**
 * Created by mac on 16/5/11.
 * if (s.params.touchMoveStopPropagation && !s.params.nested) {
 */
;(function($){

    var module = angular.module('ion-images');
    module.provider('imageModal', ImageModalProvider);

    function ImageModalProvider(){
        var def_opts = {
            images:[]
        }
        this.$get = ImageModalService;
        ImageModalService.$inject = ['$q','$ionicModal', '$rootScope', 'imgUtils', '$ionicScrollDelegate']
        function ImageModalService($q, $ionicModal, $rootScope, imgUtils, $ionicScrollDelegate){
            return {
                createModal: createModal
            }
            function createModal(opts){
                opts = $.extend({}, def_opts, opts);
                var defer = $q.defer();
                var scope = $rootScope.$new(true);
                scope.data = {};
                scope.opts={touchMoveStopPropagation:false};
                if(imgUtils.isType(opts.images, 'Array')){
                    scope.images = opts.images
                }else{
                    scope.images = [];
                }
                $ionicModal.fromTemplateUrl('src/js/imageModal/image-modal.html',{
                    scope: scope, animation:'slide-fade'
                }).then(function (modal) {
                    defer.resolve(new ImageModal(scope, modal, $ionicScrollDelegate));
                });
                return defer.promise;
            }
        }
    }

    function ImageSource(src){
        var self = this;
        self.src = src;
        self.zoom = 1;
        $("<img/>").attr("src", src).load(function(){
            self.width = this.width;
            self.height = this.height;
        });
    }

    function ImageModal(scope, modal, $ionicScrollDelegate){
        var self = this;
        self.modal = modal;
        scope.$watch('data.slider', function(){
            self.slider = scope.data.slider;
            if(self.slider && self.slider.params){
                self.slider.params.onSlideChangeEnd = scope.slideChange;
            }
        })

        self.scope = scope;
        self.clickCount = 0;
        self.$ionicScrollDelegate = $ionicScrollDelegate;
        scope.clickTap = function(index){
            self.clickCount++;
            if(self.clickCount == 1){
                setTimeout(function(){
                    if(self.clickCount == 1){
                        self.hide();
                    }else{
                        self.scale(index);
                    }
                    self.clickCount = 0;
                }, 300);
            }
        }
        scope.wrapScroll = function(index){
            var images = self.scope.images[index];
            var ionicScroll = self.$ionicScrollDelegate.$getByHandle("scroll"+index);
            var scrollView = ionicScroll.getScrollView();
            images.zoom = scrollView.__zoomLevel;
            if(images.zoom != 1 && self.slider.activeIndex == index){

                var offset = {
                    scrollLeft: scrollView.__scrollLeft,
                    scrollTop: scrollView.__scrollTop,
                    maxScrollLeft: scrollView.__maxScrollLeft,
                    maxScrollTop: scrollView.__maxScrollTop
                }

                if(offset.scrollLeft > offset.maxScrollLeft){
                    self.allowSwipe(true);
                }else if(offset.scrollLeft < 0){
                    self.allowSwipe(true);
                }else{
                    self.allowSwipe(false);
                }
            }
        }
        scope.slideChange = function(){
            var index = self.slider.activeIndex;
            var images = self.scope.images[index];
            self.allowSwipe(images.zoom == 1)
        }
    }

    ImageModal.prototype = {
        setImage: function(srcs){
            if(srcs){
                var images = [];
                angular.forEach(srcs, function(src){
                    images.push(new ImageSource(src));
                })
                this.scope.images = images;
            }
        },
        reset: function(){
            var self = this;
            this.scope.images.forEach(function(img, index){
                img.zoom = 2;
                self.scale(index);
            })
        },
        show: function(index, opts){
            this.slider.activeIndex = index;
            this.modal.show();
        },
        hide: function(){
            this.modal.hide();
            this.reset();
        },
        scale: function(index){
            console.log(this.slider.isEnd);
            var images = this.scope.images[index];
            images.zoom = images.zoom == 1? 2 : 1;
            var ionicScroll = this.$ionicScrollDelegate.$getByHandle("scroll"+index);
            console.log(ionicScroll)
            ionicScroll.zoomTo(images.zoom, true);
            this.allowSwipe(images.zoom == 1);
        },
        allowSwipe: function(isAllow, nextOrPrev){
            if(!nextOrPrev || nextOrPrev.toLowerCase() == 'next'){
                if(isAllow){
                    this.slider.unlockSwipeToNext();
                }else{
                    this.slider.lockSwipeToNext();
                }
            }
            if(!nextOrPrev || nextOrPrev.toLowerCase() == 'prev'){
                if(isAllow){
                    this.slider.unlockSwipeToPrev();
                }else{
                    this.slider.lockSwipeToPrev();
                }
            }
        }
    }


})(jQuery);