export class Settings {
    constructor() {
        this.DEFAULT = {
            "refresh": 30,
            "units"  : 1000
        }

        this.routerIp = '';
        this.units    = this.DEFAULT.units;
        this.key      = '';
        this.refresh  = this.DEFAULT.refresh;

    }

    parsePayload(payload) {
        this.routerIp = payload.settings.routerIp;
        this.units    = Number.parseInt(payload.settings.units);
        this.key      = payload.settings.key;

        this.refresh = Number.parseInt(payload.settings.refresh) || this.DEFAULT.refresh;
    }

    toggleUnits() {
        this.units = this.DEFAULT.units === this.units ? 8000 : this.DEFAULT.units;
    }
}
