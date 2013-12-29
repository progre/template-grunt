/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-route.d.ts"/>

var root = '/';

var app = angular.module('app', ['ngRoute', 'ngAnimate']);
app.config(['$routeProvider', '$locationProvider',
    ($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) => {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when(root, {
                templateUrl: root + 'html/index.html', controller: 'IndexController'
            }).otherwise({
                templateUrl: root + 'html/404.html'
            });
    }
]);
app.controller('IndexController',
    [() => {
    }]);

angular.bootstrap(<any>document, ['app']);
