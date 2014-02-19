export = Input;
class Input {
    private keys = new Map<string, boolean>();
    private direction = 5;

    constructor(
        private keyConfigs = new Map<number, string>(),
        private element: {
            addEventListener(type: string, listener: (ev: KeyboardEvent) => any, useCapture?: boolean): void;
            removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
        } = window) {
        this.element.addEventListener('keydown', this.onKeyDown);
        this.element.addEventListener('keyup', this.onKeyUp);
    }

    dispose() {
        this.element.removeEventListener('keydown', this.onKeyDown);
        this.element.removeEventListener('keyup', this.onKeyUp);
    }

    get(key: string) {
        return this.keys.get(key);
    }

    getDirection() {
        return this.direction;
    }

    private onKeyDown(ev: KeyboardEvent) {
        var name = this.keyConfigs.get(ev.keyCode);
        if (name == null)
            return;
        this.keys.set(name, true);
        if (isDirectionKey(name)) {
            this.onDirectionKeyDown(name);
        }
    }

    private onKeyUp(ev: KeyboardEvent) {
        var name = this.keyConfigs.get(ev.keyCode);
        if (name == null)
            return;
        this.keys.set(name, false);
        if (isDirectionKey(name)) {
            this.onDirectionKeyUp(name);
        }
    }

    private onDirectionKeyDown(keyName: string) {
        if (this.direction === 5)
            this.direction = keyNameToDirection(keyName);
        else
            this.direction = checkDirection(this.keys, this.direction);
    }

    private onDirectionKeyUp(keyName: string) {
        if (this.direction === 5)
            return;
        this.direction = checkDirection(this.keys, this.direction);
    }
}

function isDirectionKey(keyName: string) {
    switch (keyName) {
        case 'up': case 'right': case 'down': case 'left': return true;
        default: return false;
    }
}

/**
    キー入力を基に、レバーがどの方向を向いているか返す
    @param keys キー入力
    @param direction 方向
*/
function checkDirection(keys: Map<string, boolean>, direction: number) {
    var check = this.direction;
    for (var i = 0; i < 8; i++) {
        if (testDirection(this.keys, check))
            return check;
        check = clockRotate(check);
    }
    return 5;
}

function testDirection(keys: Map<string, boolean>, direction: number) {
    switch (direction) {
        case 8: return !keys['left'] && keys['up'] && !keys['right'];
        case 9: return keys['up'] && keys['right'];
        case 6: return !keys['up'] && keys['right'] && !keys['down'];
        case 3: return keys['right'] && keys['down'];
        case 2: return !keys['right'] && keys['down'] && !keys['left'];
        case 1: return keys['down'] && keys['left'];
        case 4: return !keys['down'] && keys['left'] && !keys['up'];
        case 7: return keys['left'] && keys['up'];
        default: return !keys['up'] && !keys['left'] && !keys['down'] && !keys['right'];
    }
}

function clockRotate(direction: number) {
    switch (direction) {
        case 8: return 9;
        case 9: return 6;
        case 6: return 3;
        case 3: return 2;
        case 2: return 1;
        case 1: return 4;
        case 4: return 7;
        case 7: return 8;
        default: return 5;
    }
}

function keyNameToDirection(keyName: string) {
    switch (keyName) {
        case 'up': return 8;
        case 'right': return 6;
        case 'down': return 2;
        case 'left': return 4;
        default: return 5;
    }
}
