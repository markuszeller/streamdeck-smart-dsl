export class Settings {
    constructor() {
        this.routerIp      = '';
        this.units         = 1000;
        this.key           = '';
    }

    parsePayload(payload) {
        this.routerIp = payload.settings.routerIp;
        this.units    = parseInt(payload.settings.units);
        this.key      = payload.settings.key;
    }

    toggleUnits() {
        this.units = 1000 === this.units ? 8000 : 1000;
    }
}
