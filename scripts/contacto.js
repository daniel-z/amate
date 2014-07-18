/* global angular, $, console, amateApp */

// CONTACT PAGE
amateApp.controller('contactController', ['$scope', '$http',
  function ($scope, $http) {
    // fixing ipad keyboard pushing footer up in chrome
    $('footer').addClass('hide');
    $('input, textarea').on('focus', function() {
      $('footer').addClass('hide');
    });
    $('input, textarea').on('blur', function() {
      $('footer').removeClass('hide');
    });

    $.backstretch("images/gallery/03/29-a.jpg");

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
          "subject": "Formulario Contacto - Sitio Web: Arte Amate",
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