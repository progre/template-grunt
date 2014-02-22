/// <reference path="../../../../typings/easeljs/easeljs.d.ts"/>

export = mainLoop;
function mainLoop(onUpdating: Function, stage: createjs.Stage, document = window.document) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', () => {
        if (document.hidden)
            return;
        onUpdating();
        stage.update();
    });
}
