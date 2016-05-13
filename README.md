Ionic Images 
========================

Ionic Image 是专门为Ionic项目写的图片插件<br/>
该插件依赖jQuery、AngularJS与Ionic<br/>
如果普通Web的AngularJS项目而非移动Web项目想使用，一样需要依赖Ionic

* 该版本目前有如下功能
    * 图片组预览，自动cover模式压缩到固定大小单元格内
    * 图片组每行显示图片到个数可以设置，最多不能超过5个，不管显示多少个，都可以自适应平分当前行
    * 图片组没个图片可以点击放大，浏览大图。
    * 大图浏览模式下，可以左右滑动切换图片组到图片
    * 大图浏览模式下可以双击放大缩小，也支持手势放大缩小
    

安装方法
-----------------------

    $ bower install https://github.com/suifengJC614/ionic-images.git --save-dev
    
使用方法
-----------------------


### Step 1、引入javascript以及style文件

```html
<link href="lib/ionic/css/ionic.css" rel="stylesheet">
<link href="lib/ionic-images/dist/ionic-images.min.css" rel="stylesheet">
<script src="lib/ionic/js/ionic.bundle.js"></script>
<script src="lib/jquery/dist/jquery.min.js"></script>
<script src="lib/ionic-images/dist/ionic-images.all.min.js"></script>
```

### Step 2、 编写controller并初始化数据

```javascript
var module = angular.module('starter', ['ionic', 'ion-images']);//设置依赖
//在Controller中绑定图片数据
module.controller('ImageGroupCtrl', ['$scope', function($scope){
    $scope.images = [
        "img/adam.jpg",
        "img/ben.png",
        "img/max.png",
        "img/mike.png",
        "img/perry.png"
    ];
}])
```

### Step 3、 编写Html代码，使用ion-image相关指令

```html
<body ng-app="starter">
<ion-content ng-controller="ImageGroupCtrl">
  <img-group col="4"><!-- 表示一行4列 -->
    <img-wrap bg-src="src" ng-repeat="src in images track by $index"></img-wrap>
  </img-group>
</ion-content>
</body>
```

    此外img-wrap也可以单独使用，指定bg-src即可，也可以将bg-src绑定动态修改

其他
---------------------------

如果发现有bug，可以邮件jichao614@foxmail.com，将会即使进行修正<br/>
后期会陆续将选择图片、上传图片功能加入


