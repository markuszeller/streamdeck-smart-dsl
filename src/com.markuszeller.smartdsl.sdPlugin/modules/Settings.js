export class Settings {
    constructor() {
        this.routerIp      = '';
        this.units         = 1000;
        this.key           = '';
        this.refresh  = this.DEFAULT.refresh;
    }

    parsePayload(payload) {
        this.routerIp = payload.settings.routerIp;
        this.units    = parseInt(payload.settings.units);
        this.key      = payload.settings.key;

        this.refresh = parseInt(payload.settings.refresh) || this.DEFAULT.refresh;
    }

    toggleUnits() {
        this.units = 1000 === this.units ? 8000 : 1000;
    }
}
