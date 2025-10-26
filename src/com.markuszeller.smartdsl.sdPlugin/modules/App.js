export class App {
    constructor(refreshIntervalMs, crypt, canvas, action, settings) {
        this.refreshInMs = refreshIntervalMs;
        this.crypt       = crypt;
        this.canvas      = canvas;
        this.action      = action;
        this.settings    = settings;
        this.interval    = null;
        this.values = {};

        this.addHandlers();
    }

    getApiUrl() {
        return `http://${this.settings.routerIp}/data/Status.json?_=${performance.now()}`;
    }

    update() {
        if (!this.settings.routerIp) {
            return;
        }

        fetch(this.getApiUrl())
            .then(response => response.text())
            .then(text => {
                this.values = this.crypt.decrypt(text);
                this.canvas.draw(this.values, this.settings.actionContext, this.settings.units);
            })
            .catch(error => {
                console.error('error', error);
            });
    }

    addHandlers() {
        this.action.onWillAppear(({action, context, device, event, payload}) => {
            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            this.update();
        });

        this.action.onWillDisappear(({action, context, device, event, payload}) => {
            this.interval && clearInterval(this.interval);
        });

        this.action.onDidReceiveSettings(({context, payload}) => {
            this.settings.parsePayload(payload);
            this.crypt.setKey(this.settings.key);

            this.update();
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.actionContext, this.settings.units);
        });

        this.action.onKeyUp(({action, context, device, event, payload}) => {
            this.settings.toggleUnits();
            payload.settings.units = this.settings.units;
            $SD.setGlobalSettings(payload);
            this.values.needRedraw = true;
            this.canvas.draw(this.values, this.settings.actionContext, this.settings.units);
        });
    }
}
