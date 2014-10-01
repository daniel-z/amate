/* global angular, $, console, amateApp*/

// GALLERY PAGE
amateApp.controller('galleryController', ['$scope', '$http', 'langControl',
  function ($scope, $http, $langControl) {
    $scope.page = "gallery";
    $langControl.refresh();
    $.backstretch("images/gallery/03/30-b.jpg");

    $http({method: 'GET', url: 'data/gallery.json'}).
      success(function(data, status, headers, config) {
        $scope.filters = data.filters;
        $scope.gallery = data.images;
      }).
      error(function(data, status, headers, config) {
        console.error('error on gallery:', status, headers, config, data);
      });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $('#images-gallery').mixItUp({
        animation: {
          duration: 400,
          effects: 'translateZ(-360px) rotateZ(20deg) fade',
          easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'
        }
      });

      $("a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed: 'fast',
        show_title: false,
        allow_resize: true,
        image_markup: '<div style="background-image: url(\'{path}\'); background-size: 100%;">'+
          '<img class="watermark" id="fullResImage" src="images/watermark-800x400.png"/>'+
          '</div>'
      });

      $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        if(newUrl.match(newUrl.match(/#prettyPhoto/))) {
          event.preventDefault();
        }
      });
    }); //ngRepeatFinished
  }]); // Gallery Page
