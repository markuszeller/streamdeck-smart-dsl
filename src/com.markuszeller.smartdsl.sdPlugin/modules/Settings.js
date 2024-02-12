export class Settings {
    constructor() {
        this.routerIp      = '';
        this.units         = 1000;
        this.actionContext = '';
    }

    parsePayload(payload) {
        this.routerIp = payload.settings.routerIp;
        this.units    = parseInt(payload.settings.units);
    }

    toggleUnits() {
        this.units = 1000 === this.units ? 8000 : 1000;
    }
}
