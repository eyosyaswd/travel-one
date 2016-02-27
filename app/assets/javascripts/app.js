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
]);

app.factory('accountFactory', ['$http', 
  function($http){
    var urlBase = '/api/accounts';
    var account = {};

    account.getAccounts = function() {
      return $http.get(urlBase);
    }

    account.getAccount = function(id) {
      return $http.get(urlBase + "/" + id)
    }

    // for new savings account, just provide name
    account.createAccount = function(name) {
      return $http.post(urlBase, {"nickname": name});
    }

    return account;
  }
]);

app.factory('placesFactory', ['$http', 
  function($http){
    var urlBase = '/api/places';
    var places = {};

    places.getPlaces = function(type, city) {
      return $http.get(urlBase, { "type": type, "city": city });
    }

    return places;
  }
]);

app.controller('VacationController', ['$scope', '$auth', 'vacationFactory', 'accountFactory', 'placesFactory',
  function($scope, $auth, vacationFactory, accountFactory, placesFactory){
    $scope.name = 'Will';

    $scope.places_types = ["points_of_interest", "bars", "night_club", "museum", "zoo", "parks"];

    function getAccounts() {
      accountFactory.getAccounts()
        .success(function(accounts) {
          $scope.accounts = accounts;
        })
        .error(function(error) {
          $scope.status = "Unable to load accounts: " + error.message;
        });
    }

    function getVacations() {
      vacationFactory.getVacations()
        .success(function(vacations) {
          $scope.vacations = vacations;
        })
        .error(function(error) {
          $scope.status = "Unable to load vacations: " + error.message;
        });
    }

    $scope.getPlaces = function(type, city) {
      console.log("clicked");
      placesFactory.getPlaces(type, city)
        .success(function(places) {
          $scope.places = places;
        })
        .error(function(error) {
          $scope.places = places;
          $scope.status = "Unable to load places: " + error.message;
        });
    }

    $scope.testPlaces = function(type, city) {
      console.log(type + " " + city);
      return type + " " + city;
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
    getAccounts();
  }
]);


