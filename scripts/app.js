/* global angular, $, console*/

var amateApp = angular.module('amateApp', []);

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

amateApp.factory('langControl', function() {
    var defaultLang = 'esp',
    availableLanguages = ['esp', 'eng'],
    langToggle = {
      'esp': 'eng',
      'eng': 'esp'
    },
    langControl = this,
    actualLang = '',

    init = function () {
      actualLang = actualLang || defaultLang;
    },

    initButtons = function() {
      $('.btn-lang').each(function(){
        $(this).on('click', function(){
          action(this);
        });
      });
    },

    action = function(element){
      var language = $(element).data('lang');
      updateActualLang(language);
      return;
    },

    updateActualLang = function(newLang){
      actualLang = newLang;
      _updateInterface(newLang);
    },

    refresh = function () {
      initButtons();
      _updateInterface(getActualLang());
    },

    _updateInterface = function(newLang){
      if(!newLang) {return;}
      _updateBody(newLang);
      _updateControls(newLang);
      return;
    },

    _updateBody = function(newLang) {
      var oldLang = langToggle[newLang];
      if ($('body').data('lang') === newLang) { return; }
      $('body').removeClass('lang-'+oldLang)
        .addClass('lang-'+newLang)
        .data('lang', newLang);
    },

    _updateControls = function(newLang) {
      var oldLang = langToggle[newLang];
      $('[data-lang='+oldLang+']').removeClass('active');
      $('[data-lang='+newLang+']').removeClass('active');
    },

    getActualLang = function() {
      return actualLang;
    };

    init();

    return {
      'refresh': refresh,
      'switch': updateActualLang,
      'getActualLang': getActualLang,
      'defaultLang': defaultLang,
    };
  });

amateApp.controller('headerController', ['langControl',
  function ($langControl) {
    $langControl.refresh();
  }]);

// HOME PAGE
amateApp.controller('homeController', ['$scope', '$http', 'langControl',
  function ($scope, $http, $langControl) {
    var backgroundConfig = $http.get('data/home-slider-data.json');
    $scope.page = "home";

    $langControl.refresh();

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

// GALLERY PAGE
amateApp.controller('galleryController', ['$scope', '$http', 'langControl',
  function ($scope, $http, $langControl) {
    $scope.page = "gallery";

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

// ABOUT US
amateApp.controller('aboutController', ['$scope', '$http', 'langControl',
  function ($scope, $http, $langControl) {
    $scope.lang = $langControl.getActualLang();
    $langControl.refresh();
  }]);

