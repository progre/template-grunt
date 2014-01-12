/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/linq.d.ts"/>
/// <reference path="../../typings/promise.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-route.d.ts"/>
/// <reference path="../../typings/createjs/createjs.d.ts"/>
/// <reference path="../../typings/easeljs/easeljs.d.ts"/>
/// <reference path="../../typings/tweenjs/tweenjs.d.ts"/>
/// <reference path="../../typings/preloadjs/preloadjs.d.ts"/>

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
        var loadQueue = new createjs.LoadQueue();
        loadQueue.loadManifest([root + 'img/loading.png'], true);
        loadQueue.on('complete', (e: any) => {
            var stage = new createjs.Stage(<HTMLCanvasElement>$('#main')[0]);
            var bitmap = new createjs.Bitmap(<HTMLImageElement>
                loadQueue.getResult(root + 'img/loading.png'));
            bitmap.regX = 16;
            bitmap.regY = 16;
            bitmap.x = 960 / 2;
            bitmap.y = 540 / 2;
            stage.addChild(bitmap);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.on('tick', () => {
                bitmap.rotation += 7;
                stage.update();
            });
        });
    }
]);

angular.bootstrap(<any>document, ['app']);
