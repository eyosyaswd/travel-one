var app = angular.module('travelApp', ['ng-token-auth']);

app.config(function($authProvider) {
      $authProvider.configure({
          apiUrl: ''
      });
  });

app.factory('vacationFactory', ['$http', 
  function($http) {
    var urlBase = '/api/vacations';
    var vacation = {};

    vacation.getVacations = function() {
      return $http.get(urlBase);
    }

    vacation.getVacation = function(id) {
      return $http.get(urlBase + "/" + id);
    }

    vacation.createVacation = function(vacation) {
      return $http.post(urlBase, vacation);
    }

    vacation.deleteVacation = function(id) {
      return $http.delete(urlBase + "/" + id);
    }

    return vacation;
  }
])


app.controller('VacationController', ['$scope', '$auth', 'vacationFactory',
  function($scope, $auth, vacationFactory){
    $scope.name = 'Will';

    function getVacations() {
      vacationFactory.getVacations()
        .success(function(vacations) {
          $scope.vacations = vacations;
        })
        .error(function(error) {
          $scope.status = "Unable to load vacations: " + error.message;
        });
    }

    $scope.login = function() {
      $auth.submitLogin({
        // just use the test user
        email: "test@email.wm.edu",
        password: "password"
      }).then(function(res) {
        console.log(res);
      }).catch(function (res) {
        console.log(res);
      });
    }

    $scope.login();
    getVacations();
  }
]);


