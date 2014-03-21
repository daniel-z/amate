/* global angular, $ */

var amateApp = angular.module('amateApp', ['ngRoute', 'ngAnimate']);

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
  }]);

