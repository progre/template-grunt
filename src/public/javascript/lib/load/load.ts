/// <reference path="../../../../typings/promise.d.ts"/>
/// <reference path="../../../../typings/easeljs/easeljs.d.ts"/>
/// <reference path="../../../../typings/preloadjs/preloadjs.d.ts"/>
import mainLoop = require('../mainloop/mainloop');

export = load;
function load(stage: createjs.Stage, manifest: Object[], options: any = {}) {
    if (options.basePath == null) options.basePath = '';
    if (options.preWait == null) options.preWait = 500;
    if (options.fadeTime == null) options.fadeTime = 500;
    if (options.debug == null) options.debug = false;
    if (options.centerImage == null) options.centerImage = 'img/brand.png';
    if (options.rotateImage == null) options.rotateImage = 'img/loading.png';

    return Promise.cast()
        .then(() => new Promise<createjs.LoadQueue>(resolve => {
            var preLoadQueue = new createjs.LoadQueue();
            preLoadQueue.setMaxConnections(6);
            preLoadQueue.loadManifest([options.centerImage, options.rotateImage], true, options.basePath);
            preLoadQueue.on('complete', () => resolve(preLoadQueue));
        }))
        .then(preLoadQueue => new Promise<any[]>(resolve => {
            var width = stage.canvas.width;
            var height = stage.canvas.height;

            stage.addChild(createBrandScreen(
                width, height,
                <HTMLImageElement>preLoadQueue.getResult(options.centerImage)));

            var mask = new createjs.Shape();
            mask.graphics
                .beginFill('#000')
                .drawRect(0, 0, width, height);
            mask.alpha = 1.0;
            var maskTween = createjs.Tween.get(mask);
            maskTween
                .wait(options.preWait)
                .to({ alpha: 0.0 }, options.fadeTime)
                .wait(1500);
            stage.addChild(mask);

            var loading = new createjs.Bitmap(<HTMLImageElement>
                preLoadQueue.getResult(options.rotateImage));
            loading.regX = loading.image.width / 2;
            loading.regY = loading.image.height / 2;
            loading.x = width / 2;
            loading.y = height / 7 * 5;
            loading.visible = false;
            var loadingTween = createjs.Tween.get(loading)
                .wait(options.preWait)
                .wait(options.fadeTime)
                .set({ visible: true });
            stage.addChild(loading);

            var onTick = () => {
                loading.rotation += 7;
            };
            stage.on('tick', onTick);

            var loadQueue = new createjs.LoadQueue(false);
            loadQueue.installPlugin(createjs.Sound);
            loadQueue.setMaxConnections(6);
            loadQueue.loadManifest(manifest, true, options.basePath);
            onCompleted(loadQueue, () => {
                stage.off('tick', onTick);
                loadingTween.set({ visible: false });
                loading.visible = false;
                resolve([maskTween, loadQueue]);
            });
        }))
        .then(val => new Promise<createjs.LoadQueue>(resolve => {
            var maskTween: createjs.Tween = val[0];
            var loadQueue: createjs.LoadQueue = val[1];
            if (options.debug) {
                resolve(loadQueue);
            }
            maskTween
                .to({ alpha: 1.0 }, options.fadeTime)
                .call(() => resolve(loadQueue));
        }))
        .then(loadQueue => {
            stage.removeAllChildren();
            return loadQueue;
        });
}

function onCompleted(loadQueue: createjs.LoadQueue, func: Function) {
    if (loadQueue.loaded) {
        func();
    } else {
        loadQueue.on('complete', (e: any) => func());
    }
}

function createBrandScreen(width: number, height: number, centerImage: HTMLImageElement) {
    var brandScreen = new createjs.Container();

    var bg = new createjs.Shape();
    bg.graphics
        .beginFill('#fff')
        .drawRect(0, 0, width, height);
    brandScreen.addChild(bg);
    var brand = new createjs.Bitmap(centerImage);
    brand.regX = brand.image.width / 2;
    brand.regY = brand.image.height / 2;
    brand.x = width / 2;
    brand.y = height / 2;
    brandScreen.addChild(brand);
    return brandScreen;
}