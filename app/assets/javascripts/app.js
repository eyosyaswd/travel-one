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

app.factory('flightFactory', ['$http',
  function($http){
    var urlBase = '/api/flights';
    var flight = {};

    flight.getFlights = function(origin, depart, ret, max) {
      options = {
        "origin": origin,
        "departuredate": depart,
        "returndate": ret,
        "maxfare": max
      }
      return $http({
        url: urlBase,
        method: "GET",
        params: options
      });
    }

    return flight;
  }
]);

app.factory('accountFactory', ['$http',
  function($http) {
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
      return $http.post(urlBase, {
          "nickname": name
      });
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

app.controller('vacationController', ['$scope', '$auth', 'vacationFactory', 'accountFactory', 'placesFactory', 'flightFactory',
  function($scope, $auth, vacationFactory, accountFactory, placesFactory, flightFactory){
    $scope.name = 'Will';

    $scope.places_types = ["points_of_interest", "bars", "night_club", "museum", "zoo", "parks"];

    function getAccounts() {
      accountFactory.getAccounts()
        .success(function(accounts) {
          $scope.accounts = accounts;
          $scope.selectedAccount = accounts[0];
          console.log($scope.accounts);
        })
        .error(function(error) {
          $scope.status = "Unable to load accounts: " + error.message;
        });
    }

    function getVacations() {
      vacationFactory.getVacations()
        .success(function(vacations) {
          $scope.vacations = vacations;
          console.log($scope.vacations);
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

    // Load details about selected trip
    $scope.loadTrip = function() {

    }

    // get flights from Sabre
    $scope.getFlights = function() {
      var picker = $('input[name="daterange"]');
      var startMoment = moment(picker.data('daterangepicker').startDate);
      var endMoment = moment(picker.data('daterangepicker').endDate);
      var startDate = startMoment.format("YYYY-MM-DD");
      var endDate = endMoment.format("YYYY-MM-DD");

      flightFactory.getFlights($scope.origin, startDate, endDate, $scope.max_price)
        .success(function(flights) {
          $scope.flights = flights["FareInfo"];
          console.log($scope.flights);
        })
        .error(function(error) {
          $scope.status = "Unable to load flights: " + error.message;
        });
    }

    $scope.selectAccount = function(account) {
      $scope.selectedAccount = account;
    }

    $scope.login();
    getVacations();
    getAccounts();
  }
]);

