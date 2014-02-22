/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-route.d.ts"/>
/// <reference path="../../typings/createjs/createjs.d.ts"/>
/// <reference path="../../typings/easeljs/easeljs.d.ts"/>
/// <reference path="../../typings/tweenjs/tweenjs.d.ts"/>
/// <reference path="../../typings/preloadjs/preloadjs.d.ts"/>
/// <reference path="../../typings/soundjs/soundjs.d.ts"/>
import load = require('./lib/load/load');
import mainLoop = require('./lib/mainloop/mainloop');

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
app.controller('IndexController', [
    () => {
        var stage = new createjs.Stage(<HTMLCanvasElement>$('#main')[0]);
        load(stage, [])
            .then(() => {
            })
            .catch(e => console.error(e.message, e));
        mainLoop(() => {
        }, stage);
    }
]);

angular.bootstrap(<any>document, ['app']);
