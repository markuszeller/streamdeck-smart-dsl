"use strict";

(function () {
    const refreshInterval = 4000;
    const myAction        = new Action('com.markuszeller.smartdsl.action');
    const iv              = 'xxxx=';
    const keyArray        = [
        -1,
        1,
        1,
        -1,
        -1,
        -1,
        1,
        -1
    ];

    let interval      = null;
    let routerIp      = '';
    let canvas        = null;
    let ctx           = null;
    let actionContext = '';
    let units         = 1000;
    let history       = '';
    let needRedraw    = true;
    let values        = {};

    const getApiUrl = () => `http://${routerIp}/data/Status.json?_=${performance.now()}`;

    const initCanvas = () => {
        canvas        = document.createElement('canvas');
        canvas.width  = 144;
        canvas.height = 144;
        ctx           = canvas.getContext('2d');
        document.body.appendChild(canvas);
    }

    const drawCanvas = () => {
        if (!ctx || false === needRedraw) {
            return;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 144, 144);
        ctx.font      = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'online' === values.dsl_link_status ? '#0f0' : '#f00';
        ctx.fillText(`${values.dsl_link_status}`, 72, 50);
        ctx.fillStyle = 'white';
        ctx.fillText(`${(values.inet_download / units).toFixed(2)} / ${(values.dsl_downstream / units).toFixed(2)}`, 72, 80);
        ctx.fillText(`${(values.inet_upload / units).toFixed(2)} / ${(values.dsl_upstream / units).toFixed(2)}`, 72, 110);
        ctx.fillStyle = '#0af';
        ctx.fillText(`${1000 === units ? 'Mbit' : 'MB'}/s`, 72, 136);
        $SD.setImage(actionContext, canvas.toDataURL());
    }

    const decodeEncryption = (text) => {
        if (history !== text) {
            needRedraw = true;
            history    = text;
        }
        const cipherText  = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(text));
        const decryptText = sjcl.decrypt(keyArray, '{"iv":"' + iv + '","v":1,"iter":1000,"ks":256,"ts":128,"mode":"ccm","adata":"","cipher":"aes","salt":"","ct":"' + cipherText + '"}');
        JSON.parse(decryptText).map(element => {
            const key = element.varid;
            if (key.startsWith('dsl_') || key.startsWith('inet_')) {
                values[key] = element.varvalue;
            }
        });
    }

    const update = () => {
        if (routerIp) {
            fetch(getApiUrl())
                .then(response => response.text())
                .then(text => {
                    decodeEncryption(text);
                    drawCanvas();
                })
                .catch(error => {
                    console.error('error', error);
                });
        }
    };

    myAction.onWillAppear(({action, context, device, event, payload}) => {
        routerIp      = payload.settings.routerIp;
        actionContext = context;
        initCanvas();
        interval = setInterval(update, refreshInterval);
        update();
    });

    myAction.onWillDisappear(({action, context, device, event, payload}) => {
        if (interval) {
            clearInterval(interval);
        }
    });

    myAction.onDidReceiveSettings(({context, payload}) => {
        routerIp   = payload.settings.routerIp;
        units      = parseInt(payload.settings.units);
        needRedraw = true;
        drawCanvas();
    });

    myAction.onKeyUp(({action, context, device, event, payload}) => {
        units = 1000 === units ? 8000 : 1000;
        payload.settings.units = units;
        $SD.setGlobalSettings(payload);
        needRedraw = true;
        drawCanvas();
    });
})();
