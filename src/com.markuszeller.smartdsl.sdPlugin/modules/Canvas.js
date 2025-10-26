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

    add() {
        document.body.appendChild(this.canvas);
    }

    draw(values, actionContext, units) {
        if (!this.ctx || false === values.needRedraw) {
            return;
        }

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 144, 144);
        this.ctx.font      = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'online' === values.dsl_link_status ? '#0f0' : '#f00';
        this.ctx.fillText(`${values.dsl_link_status}`, 72, 50);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`${(values.inet_download / units).toFixed(2)} / ${(values.dsl_downstream / units).toFixed(2)}`, 72, 80);
        this.ctx.fillText(`${(values.inet_upload / units).toFixed(2)} / ${(values.dsl_upstream / units).toFixed(2)}`, 72, 110);
        this.ctx.fillStyle = '#0af';
        this.ctx.fillText(`${1000 === units ? 'Mbit' : 'MB'}/s`, 72, 136);
        $SD.setImage(actionContext, this.canvas.toDataURL());
    }
}
