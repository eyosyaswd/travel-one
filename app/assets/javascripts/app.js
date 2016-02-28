var app = angular.module('travelApp', ['ng-token-auth', 'ngRoute']);

app.config(function($authProvider, $routeProvider) {
  $authProvider.configure({
    apiUrl: ''
  });

  $routeProvider
    .when("/", {
      templateUrl: "vacations.html",
      controller: "vacationController"
    })
    .when("/payplan/:id", {
      templateUrl: "payment_plans.html",
      controller: "paymentController"
    })
    .otherwise({redirectTo: "/"})
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
      return $http({
        url: urlBase,
        method: "GET",
        params: { "type": type, "city": city }
      })
    }

    return places;
  }
]);

app.factory('paymentPlanFactory', ['$http', 
  function($http){
    var urlBase = '/api/payment_plans';
    var plans = {};

    plans.createPlan = function(plan) {
      return $http.post(urlBase, plan);
    }

    return plans;
  }
]);

app.controller('vacationController', ['$scope', '$window', '$auth', 'vacationFactory', 'accountFactory', 'placesFactory', 'flightFactory',
  function($scope, $window, $auth, vacationFactory, accountFactory, placesFactory, flightFactory){
    $scope.place_types = ["points+of+interest", "bars", "night_club", "museum", "zoo", "parks"];
    $('input[name="daterange"]').daterangepicker(); // setup datepicker

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
          console.log($scope.places);
        })
        .error(function(error) {
          $scope.places = places;
          $scope.status = "Unable to load places: " + error.message;
        });
    }

    $scope.createVacation = function(flights) {
      var newVacation = {
        "origin": flights.OriginLocation,
        "destination": $scope.selectedFlight.DestinationLocation,
        "fare": $scope.selectedFlight.LowestFare.Fare,
        "departure_time": $scope.selectedFlight.DepartureDateTime,
        "return_time": $scope.selectedFlight.ReturnDateTime
      }
      vacationFactory.createVacation(newVacation)
        .success(function(vacation) {
          console.log("New vacation created!");

          // load new vacations
          getVacations();
          $window.location.href = '#/payplan/' + vacation.id;

        })
        .error(function(error) {
          $scope.status = "Unable to create vacation: " + error.message;
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

    $scope.selectFlight = function(flight) {
      $scope.selectedFlight = flight;

      $scope.getPlaces($scope.place_types[0], $scope.selectedFlight.DestinationLocation);
    }

    // get flights from Sabre
    $scope.getFlights = function() {
      $scope.selectedFlight = null;

      var picker = $('input[name="daterange"]');
      var startMoment = moment(picker.data('daterangepicker').startDate);
      var endMoment = moment(picker.data('daterangepicker').endDate);
      var startDate = startMoment.format("YYYY-MM-DD");
      var endDate = endMoment.format("YYYY-MM-DD");

      flightFactory.getFlights($scope.origin, startDate, endDate, $scope.max_price)
        .success(function(flights) {
          $scope.flights = flights;
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

app.controller("paymentController", ["$scope", "$routeParams", "vacationFactory", "accountFactory", "paymentPlanFactory",
  function($scope, $routeParams, vacationFactory, accountFactory, paymentPlanFactory) {
    $scope.plan = {};
    $('input[name="start_date"]').daterangepicker({"singleDatePicker": true}); // setup datepicker
    $('input[name="end_date"]').daterangepicker({"singleDatePicker": true}); // setup datepicker


    vacationFactory.getVacation($routeParams.id)
      .success(function(vacation) {
        $scope.vacation = vacation;
        console.log($scope.vacation);
      })
      .error(function(error) {
        $scope.status = "Unable to load vacation: " + error.message;
      });

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

    getAccounts();

    $scope.payNow = function() {
      // bill the selected account
      var amount = $scope.vacation.fare;
      var account = $scope.pay_now_id;

      // POST THAT SHIT
    }

    $scope.createPlan = function() {
      $scope.plan["vacation_id"] = $scope.vacation.id;
      $scope.plan["cost"] = $scope.vacation.fare;

      var picker = $('input[name="start_date"]');
      var startMoment = moment(picker.data('daterangepicker').startDate);
      var startDate = startMoment.format("YYYY-MM-DD");

      picker = $('input[name="end_date"]');
      var endMoment = moment(picker.data('daterangepicker').startDate);
      var endDate = endMoment.format("YYYY-MM-DD");

      $scope.plan["start_date"] = startDate;
      $scope.plan["end_date"] = endDate;

      // post new plan
      paymentPlanFactory.createPlan($scope.plan)
      .success(function(plan) {
        $scope.plan = plan;
        console.log($scope.plan);
      })
      .error(function(error) {
        $scope.status = "Unable to create payment plan: " + error.message;
      });
    }
  }
]);

// budget amount
// ID for an account to transfer
// start date
// end date
// interval

// next transfer = last transfer + interval
// remaining transfers = 