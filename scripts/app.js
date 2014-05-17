/* global angular, $, alert */

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
      templateUrl: 'partials/galleryInProgress.html',
      controller: 'galleryController'
    }).
    when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'aboutController'
    }).
    when('/gallery-final', {
      templateUrl: 'partials/gallery.html',
      controller: 'galleryController'
    }).
    otherwise({
      redirectTo: '/home'
    });
}]);

amateApp.factory('commonLayout', function() {
  var loadCommonElements = function(){
    $('header.main, footer').removeClass('hidden');
    $.vegas('stop')
      ('destroy')
      ({ "src": "images/al-bayo.jpg" })
      ('overlay');
  };

  $('footer').on('click mouseenter', function(){
    if($(this).hasClass('up')){
      $(this).removeClass('up');
      $(this).addClass('down');
      return;
    }

    $(this).addClass('up');
    $(this).removeClass('down');
  });

  return {
    loadCommonElements: loadCommonElements
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
amateApp.controller('galleryController', ['$scope', '$http', 'commonLayout', 'langControl',
  function ($scope, $http, commonLayout, $langControl) {
    commonLayout.loadCommonElements();

    $langControl.refresh();

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

    });

  }]);

// ABOUT US
amateApp.controller('aboutController', ['$scope', '$http', 'commonLayout', 'langControl',
  function ($scope, $http, commonLayout, $langControl) {
    $scope.lang = $langControl.getActualLang();
    commonLayout.loadCommonElements();
    $langControl.refresh();
  }]);

// CONTACT PAGE
amateApp.controller('contactController', ['$scope', '$http', 'commonLayout', 'langControl',
  function ($scope, $http, commonLayout, $langControl) {
    $scope.lang = $langControl.getActualLang();
    commonLayout.loadCommonElements();


    // fixing ipad keyboard pushing footer up in chrome
    $('footer').addClass('hide');
    $('input, textarea').on('focus', function() {
      $('footer').addClass('hide');
    });
    $('input, textarea').on('blur', function() {
      $('footer').removeClass('hide');
    });

    $langControl.refresh();

    $scope.emailForm = {};

    $scope.cleanForm = function() {
      $scope.emailForm = {};
    };

    $scope.generateMessage = function(emailData) {
      var htmlEmailTemplate = "<p>" +
          "Nombre: " + emailData.name + "<br/>" +
          "Email: " + emailData.email + "<br/>" +
          "Teléfono: " + emailData.phone + "<br/>" +
          "Mensaje: <br/>" +
          emailData.message +
        "</p>" +
        "<p>" +
          "Arte Amate - Formulario de Contacto" +
        "</p>",

        textEmailTemplate = "\n" +
          "Nombre: " + emailData.name + "\n" +
          "Email: " + emailData.email + "\n" +
          "Teléfono: " + emailData.phone + "\n" +
          "Mensaje: \n" +
          emailData.message +
        "\n" +
        "\n" +
        "Arte Amate - Formulario de Contacto" +
        "\n";

      return {
        "html": htmlEmailTemplate,
        "text": textEmailTemplate
      };
    };

    $scope.generateEmail = function(emailData) {
      var testKey = 'IUNZeo_PpN26eaINR5HDrw',
      realKey = 'qDaJ16MXpB5aV6FY6Sh6_g',
      message = $scope.generateMessage(emailData);

      return {
        "key": realKey,
        "message": {
          "html": message.html || undefined,
          "text": message.text || undefined,
          "subject": "Formulario Contacto Arte Amate Site",
          "from_email": $scope.emailForm.email,
          "from_name": $scope.emailForm.name,
          "to": [
            {
              "email": "gerardo@arteamate.com",
              "name": "Gerardo Trejo",
              "type": "to"
            }
          ],
          "headers": {
            "Reply-To": $scope.emailForm.email
          }
        }
      };
    };

    $scope.sendEmail = function(emailData) {
      if(emailData.$invalid) {
        return;
      }

      var email = $scope.generateEmail(emailData);

      $http.post('https://mandrillapp.com/api/1.0/messages/send.json', email).
      success(function(data, status, headers, config) {
        if(data[0].status === 'error' || data[0].status === 'rejected') {
          $('.alert.alert-danger').show();
        }
        else if(data[0].status === 'sent') {
          $('.alert.alert-success').show();
        }
      }).
      error(function(data, status, headers, config) {
        $('.alert.alert-danger').show();
      });
    };

  }]);

