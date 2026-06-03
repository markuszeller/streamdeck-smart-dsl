export class Canvas {
    SCREEN_WIDTH  = 144;
    SCREEN_HEIGHT = 144;
    COLOR         = {
        ok   : "#0f0",
        error: "#f00",
        blue : "#0af",
        white: "#fff",
        black: "#000"
    };
    PRECEISION    = 2;
    START_X       = 72;
    START_Y       = 50;
    LINEHEIGHT    = 20;

    actionContext = null;

    constructor() {
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
        const originalStatus = values.dsl_link_status;
        let displayStatus = originalStatus;
        this.ctx.fillStyle = 'online' === originalStatus ? this.COLOR.ok : this.COLOR.error;

        if (0 === values.inet_download && 0 === values.inet_upload) {
            this.ctx.fillStyle = this.COLOR.blue;
            displayStatus = 'connecting';
        }

        this.ctx.fillText(`${displayStatus}`, this.START_X, this.START_Y);
        this.ctx.fillStyle = this.COLOR.white;
        this.ctx.fillText(`${(values.inet_download / units).toFixed(this.PRECEISION)} / ${(values.dsl_downstream / units).toFixed(this.PRECEISION)}`, this.START_X, 80);
        this.ctx.fillText(`${(values.inet_upload / units).toFixed(this.PRECEISION)} / ${(values.dsl_upstream / units).toFixed(this.PRECEISION)}`, this.START_X, 110);
        this.ctx.fillStyle = this.COLOR.blue;
        this.ctx.fillText(`${1000 === units ? 'Mbit' : 'MB'}/s`, this.START_X, 136);

        $SD.setImage(this.actionContext, this.canvas.toDataURL());
    }

    drawStatus(status) {
        if (!this.ctx || null === this.actionContext) {
            return;
        }

        this.clearScreen();
        this.ctx.fillStyle = this.COLOR.white;

        let y = this.START_Y;
        status.forEach(line => {
            this.ctx.fillText(line, this.START_X, y);
            y += this.LINEHEIGHT;
        });

        $SD.setImage(this.actionContext, this.canvas.toDataURL());
    }

    clearScreen() {
        this.ctx.fillStyle = this.COLOR.black;
        this.ctx.fillRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    }

    setActionContext(actionContext) {
        this.actionContext = actionContext;
    }
}
