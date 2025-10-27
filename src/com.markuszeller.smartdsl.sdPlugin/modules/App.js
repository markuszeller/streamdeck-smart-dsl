export class App {
    constructor(crypt, canvas, action, settings) {
        this.KEY_LENGTH = 64;

        this.crypt       = crypt;
        this.canvas      = canvas;
        this.action      = action;
        this.settings    = settings;
        this.interval    = null;
        this.values      = {};
        this.isUpdating  = false;

        this.addHandlers();
    }

    getApiUrl() {
        return `http://${this.settings.routerIp}/data/Status.json?_=${performance.now()}`;
    }

    update() {
        if (true === this.isUpdating) {
            return;
        }

        if (!this.settings.routerIp) {
            throw Error("Router IP");
        }

        if (this.KEY_LENGTH !== this.settings.key.length) {
            throw Error("Key length");
        }

        this.isUpdating = true;

        fetch(this.getApiUrl())
            .then(response => response.text())
            .then(text => {
                this.values = this.crypt.decrypt(text);
                if (false === !!this.values) {
                    throw Error("Decryption failed.");
                }
                this.canvas.draw(this.values, this.settings.units);
            })
            .catch(error => {
                this.canvas.drawStatus(["Error", error.message]);
                console.error('error', error);
            });

        this.isUpdating = false;
    }

    addHandlers() {
        this.action.onWillAppear(({action, context, device, event, payload}) => {
            this.canvas.setActionContext(context);

            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            this.update();
            this.interval = setInterval(this.update, this.refreshInMs);
        });

        this.action.onWillDisappear(({action, context, device, event, payload}) => {
            this.interval && clearInterval(this.interval);
        });

        this.action.onDidReceiveSettings(({context, payload}) => {
            this.canvas.setActionContext(context);

            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            this.update();
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.units);
        });

        this.action.onKeyUp(({action, context, device, event, payload}) => {
            this.canvas.setActionContext(context);

            this.settings.toggleUnits();
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.units);

            payload.settings.units = this.settings.units;
            $SD.setGlobalSettings(payload);
        });
    }
}
