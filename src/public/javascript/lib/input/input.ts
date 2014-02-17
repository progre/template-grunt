export = Input;
class Input {
    private keys: { [key: string]: boolean } = {};

    constructor(private keyConfigs: { target: string; key: number; }[]) {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    dispose() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    get(key: string) {
        return this.keys[key];
    }

    private onKeyDown(ev: KeyboardEvent) {
        this.keyConfigs.forEach(keyConfig => {
            if (keyConfig.key !== ev.keyCode)
                return;
            this.keys[keyConfig.target] = true;
        });
    }

    private onKeyUp(ev: KeyboardEvent) {
        this.keyConfigs.forEach(keyConfig => {
            if (keyConfig.key !== ev.keyCode)
                return;
            this.keys[keyConfig.target] = false;
        });
    }
}
