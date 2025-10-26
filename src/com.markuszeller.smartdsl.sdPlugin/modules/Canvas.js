export class Canvas {
    constructor() {
        this.SCREEN_WIDTH  = 144;
        this.SCREEN_HEIGHT = 144;
        this.COLOR_OK      = '#0f0';
        this.COLOR_ERROR   = '#f00';
        this.COLOR_BLUE    = '##0af';
        this.PRECEISION = 2;
        this.START_X = 72;

        this.actionContext = null;
        this.canvas        = document.createElement('canvas');
        this.canvas.width  = this.SCREEN_WIDTH;
        this.canvas.height = this.SCREEN_HEIGHT;
        this.ctx           = this.canvas.getContext('2d');

        this.ctx.font      = '20px Arial';
        this.ctx.textAlign = 'center';
    }

    draw(values, units) {
        if (!this.ctx || false === values.needRedraw || null === this.actionContext) {
            return;
        }

        if (false === Object.hasOwn(values, "dsl_link_status")) {
            this.drawStatus(["No data"]);

            return;
        }

        this.clearScreen();
        this.ctx.fillStyle = 'online' === values.dsl_link_status ? this.COLOR_OK : this.COLOR_ERROR;
        this.ctx.fillText(`${values.dsl_link_status}`, this.START_X, 50);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`${(values.inet_download / units).toFixed(this.PRECEISION)} / ${(values.dsl_downstream / units).toFixed(this.PRECEISION)}`, this.START_X, 80);
        this.ctx.fillText(`${(values.inet_upload / units).toFixed(this.PRECEISION)} / ${(values.dsl_upstream / units).toFixed(this.PRECEISION)}`, this.START_X, 110);
        this.ctx.fillStyle = this.COLOR_BLUE;
        this.ctx.fillText(`${1000 === units ? 'Mbit' : 'MB'}/s`, this.START_X, 136);

        $SD.setImage(this.actionContext, this.canvas.toDataURL());
    }

    drawStatus(status) {
        if (!this.ctx || null === this.actionContext) {
            return;
        }

        this.clearScreen();
        this.ctx.fillStyle = 'white';

        let y = 50;
        status.forEach(line => {
            this.ctx.fillText(line, this.START_X, y);
            y += 20;
        });

        $SD.setImage(this.actionContext, this.canvas.toDataURL());
    }

    clearScreen() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    }

    setActionContext(actionContext) {
        this.actionContext = actionContext;
    }
}
