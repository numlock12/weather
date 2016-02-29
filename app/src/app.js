angular.module('myApp', ['ngResource'])
    .controller('MainController', ['$scope', 'apiFactory', 'configs', 'locationFactory', 'messages',
        function ($scope, apiFactory, configs, locationFactory, messages) {

            if (!locationFactory(getWithCoordinates, askForCountry)) {
                askForCountry()
            }
            
            $scope.getWithCountry = getWithCountry;

            function getWithCoordinates(data) {
                var promise = apiFactory.withCoords(data.coords.latitude, data.coords.longitude);
                handlerWeather(promise);
            }

            function getWithCountry() {
                var promise = apiFactory.withCountry($scope.country);
                handlerWeather(promise);
            }

            function askForCountry() {
                $scope.$apply(function () {
                    $scope.showInput = true;
                });
            }

            function handlerWeather(promise) {
                promise.then(success, error);

                function success(data) {

                    if (data.cod == '200') {
                        var today = data.list && data.list[0] || data;

                        $scope.country = today.name;
                        $scope.imgUrl = configs.imgUrl + today.weather[0].icon + '.png';
                        $scope.clouds = today.clouds.all; // percent
                        $scope.temp = today.main.temp;

                        $scope.weatherLoaded = true;
                        $scope.showInput = false;
                        $scope.success = messages.success;
                        $scope.error = void 0;
                    } else {
                        error();
                    }
                }

                function error() {
                    $scope.error = messages.error;
                    $scope.success = void 0;
                }
            }
        }
    ])

    .factory('apiFactory', ['$resource', 'configs', function ($resource, configs) {
        var rWithCoords = $resource(configs.apiBaseUrl + ':path?lat=:lat&lon=:lon&cnt=:cnt&units=:units',
            angular.extend({path: 'find'}, configs.baseParams), {});
        var rWithCountry = $resource(configs.apiBaseUrl + ':path?q=:q&cnt=:cnt',
            angular.extend({path: 'weather'}, configs.baseParams), {});

        function getWithCoords(latitude, longitude) {
            return rWithCoords.get({lat: latitude, lon: longitude}).$promise
        }

        function getWithCountryWithCountry(country) {
            return rWithCountry.get({q: country}).$promise
        }

        return {
            withCoords: getWithCoords,
            withCountry: getWithCountryWithCountry
        }
    }])

    .factory('locationFactory', function () {

        function getLocation(success, error) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error || angular.noop);
                return true;
            }
            return false;
        }

        return getLocation;
    })

    .value('configs', {
        apiBaseUrl: 'http://api.openweathermap.org/data/2.5/',
        imgUrl: 'http://openweathermap.org/img/w/',
        appId: '44db6a862fba0b067b1930da0d769e98',
        baseParams: {appid: '44db6a862fba0b067b1930da0d769e98', cnt: 1, units: 'metric'}
    })

    .value('messages', {
        success: 'Here is a Weather forecast for you',
        error: 'Unfortunately I`ve not been able to find a weather for you :)'
    });
