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
      templateUrl: 'partials/galleryInProgress.html',
      controller: 'galleryController'
    }).
    otherwise({
      redirectTo: '/home'
    });
}]);

// HOME PAGE
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
      ({ "src": "images/al-bayo.jpg" })
      ('overlay');
  };

  return {
    loadCommonElements: loadCommonElements
  };
});

// GALLERY PAGE
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

// CONTACT PAGE
amateApp.controller('contactController', ['$scope', '$http', 'commonLayout',
  function ($scope, $http, commonLayout) {

    commonLayout.loadCommonElements();

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
              "email": "daniel.zamorano.m@gmail.com",
              "name": "Daniel Zamorano",
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
