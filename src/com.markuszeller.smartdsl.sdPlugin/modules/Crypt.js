export class Crypt {
    constructor() {
        this.iv       = 'xxxx=';
        this.keyArray = [
            -1,
            1,
            1,
            -1,
            -1,
            -1,
            1,
            -1
        ];
        this.history  = '';
        this.values   = {};
    }

    decrypt(text) {
        this.values.needRedraw = false;

        if (this.history !== text) {
            this.values.needRedraw = true;
            this.history           = text;
        }

        const decryptText = sjcl.decrypt(
            this.keyArray,
            `{"iv":"${this.iv}","v":1,"iter":1000,"ks":256,"ts":128,"mode":"ccm","adata":"","cipher":"aes","salt":"","ct":"${sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(text))}"}`
        );

        JSON.parse(decryptText).map(element => {
            const key = element.varid;
            if (key.startsWith('dsl_') || key.startsWith('inet_')) {
                this.values[key] = element.varvalue;
            }
        });

        return this.values;
    }
}
