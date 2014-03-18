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
    backgroundConfig.success(function(data) {
      $scope.backgrounds = data;
      $.vegas('slideshow', {
        delay:8000,
        backgrounds: $scope.backgrounds
      })('overlay');
    });
  }]);

amateApp.controller('contactController', ['$scope', '$http',
  function ($scope, $http) {
    if( $.vegas ) { $.vegas('destroy'); }
  }]);

amateApp.controller('galleryController', ['$scope', '$http',
  function ($scope, $http) {
    if( $.vegas ) { $.vegas('destroy'); }
  }]);
