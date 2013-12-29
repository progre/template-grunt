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
        loadQueue.loadManifest([root + 'img/loading.gif'], true);
        loadQueue.on('complete', (e: any) => {
            var stage = new createjs.Stage(<HTMLCanvasElement>$('#main')[0]);
            var sprite = new createjs.Sprite(new createjs.SpriteSheet({
                images: [loadQueue.getResult(root + 'img/loading.gif')],
                frames: { width: 32, height: 32, regX: 16, regY: 16 },
                animations: { default: [0, 17, true, 1 / 4] }
            }), 'default');
            sprite.x = 960 / 2;
            sprite.y = 540 / 2;
            stage.addChild(sprite);
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.on('tick', () => {
                stage.update();
            });
        });
    }
]);

angular.bootstrap(<any>document, ['app']);
