/// <reference path="../../../../typings/easeljs/easeljs.d.ts"/>

export function createCharacter(image: HTMLImageElement, extendAnimations?: any) {
    var animations = {
        'stand-up': 10,
        'stand-right': 7,
        'stand-down': 1,
        'stand-left': 4,
    };
    if (extendAnimations != null) {
        (<any>Object).assign(animations, extendAnimations);
    }
    var sprite = new createjs.Sprite(new createjs.SpriteSheet({
        images: [image],
        frames: {
            width: 32, height: 32,
            regX: 16, regY: 16
        },
        animations: animations
    }));
    sprite.gotoAndStop('stand-down');
    return sprite;
}
