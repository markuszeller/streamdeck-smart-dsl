export class App {

    KEY_LENGTH = 64;

    constructor(crypt, canvas, action, settings) {
        this.crypt      = crypt;
        this.canvas     = canvas;
        this.action     = action;
        this.settings   = settings;
        this.interval   = null;
        this.values     = {};
        this.isUpdating = false;

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
            throw new Error("Router IP");
        }

        if (this.KEY_LENGTH !== this.settings.key.length) {
            throw new Error("Key length");
        }

        this.isUpdating = true;

        fetch(this.getApiUrl())
            .then(response => response.text())
            .then(text => {
                this.values = this.crypt.decrypt(text);
                if (false === !!this.values) {
                    throw new Error("Decryption failed.");
                }
                this.canvas.draw(this.values, this.settings.units);
            })
            .catch(error => {
                this.canvas.drawStatus(["Error", error.message]);
                console.error('error', error);
            });

        this.isUpdating = false;
        this.addInterval();
    }

    addHandlers() {
        this.action.onWillAppear(({context, payload}) => {
            this.canvas.setActionContext(context);
            this.canvas.drawStatus(["Initializing"]);

            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            this.update();
        });

        this.action.onWillDisappear(() => {
            this.removeInterval();
        });

        this.action.onDidReceiveSettings(({context, payload}) => {
            this.canvas.setActionContext(context);

            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            if (payload.settings.refresh !== this.settings.refresh) {
                this.addInterval();
            }

            this.update();
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.units);
        });

        this.action.onKeyUp(({context, payload}) => {
            this.canvas.setActionContext(context);

            this.settings.toggleUnits();
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.units);

            payload.settings.units = this.settings.units;
            $SD.setGlobalSettings(payload);
        });
    }

    addInterval() {
        this.removeInterval();
        this.interval = setInterval(() => {
            this.update();
        }, this.settings.refresh * 1000);
    }

    removeInterval() {
        if (null !== this.interval) {
            clearInterval(this.interval);
        }
    }
}
