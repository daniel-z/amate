/* global angular, $ */

var amateApp = angular.module('amateApp', ['ngRoute', 'ngAnimate']);

amateApp.directive('onFinishRender',
  function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    };
  });

amateApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/home', {
      templateUrl: 'partials/home.html',
      controller: 'homeController'
    }).
    when('/contact', {
      templateUrl: 'partials/contact.html',
      controller: 'contactController'
    }).
    when('/gallery', {
      templateUrl: 'partials/gallery.html',
      controller: 'galleryController'
    }).
    otherwise({
      redirectTo: '/home'
    });
}]);

amateApp.controller('homeController', ['$scope', '$http',
  function ($scope, $http) {
    var backgroundConfig = $http.get('data/home-slider-data.json');
    $scope.page = "home";

    // ToDo: ckean this up: we need a header that works fine in all pages
    $('header.main, footer').addClass('hidden');

    backgroundConfig.success(function(data) {
      $scope.backgrounds = data;
      $.vegas('destroy')
      ('slideshow', {
        delay:3000,
        backgrounds: $scope.backgrounds
      })('overlay');
    });
  }]);

amateApp.factory('commonLayout', function() {
  var loadCommonElements = function(){
    $('header.main, footer').removeClass('hidden');
    $.vegas('stop')
      ('destroy')
      ({ "src": "/images/al-bayo.jpg" })
      ('overlay');
  };

  return {
    loadCommonElements: loadCommonElements
  };
});

amateApp.controller('contactController', ['$scope', '$http', 'commonLayout',
  function ($scope, $http, commonLayout) {
    commonLayout.loadCommonElements();
  }]);

amateApp.controller('galleryController', ['$scope', '$http', 'commonLayout',
  function ($scope, $http, commonLayout) {
    commonLayout.loadCommonElements();

    $http({method: 'GET', url: 'data/gallery.json'}).
      success(function(data, status, headers, config) {
        $scope.filters = data.filters;
        $scope.gallery = data.images;
      }).
      error(function(data, status, headers, config) {
        console.log('error on gallery:', status, headers, config, data);
      });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $('#images-gallery').mixItUp({
        animation: {
          duration: 400,
          effects: 'translateZ(-360px) rotateZ(20deg) fade',
          easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
        }
      });
    });

  }]);
