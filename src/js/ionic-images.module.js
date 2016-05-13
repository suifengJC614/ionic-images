/**
 * Created by mac on 16/5/11.
 */
(function(){

   var module = angular.module('ion-images',['ionic']);

   module.constant("imgUtils",{
       isType: function (obj,type) {
          return (type === "Null" && obj === null) ||
              (type === "Undefined" && obj === void 0 ) ||
              (type === "Number" && isFinite(obj)) ||
              Object.prototype.toString.call(obj).slice(8,-1) === type;
       }
   });

   Array.prototype.insertAt=function(index, obj){
      this.splice(index,0,obj);
   }

})()