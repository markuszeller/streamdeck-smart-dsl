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
        this.key     = "xxxx";
        this.history = '';
        this.values  = {};
    }

    decrypt(text) {
        this.values.needRedraw = false;

        if (this.history !== text) {
            this.values.needRedraw = true;
            this.history           = text;
        }

        try {
            const iv         = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(this.key.slice(0, 16)));
            const cypherText = sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(text));
            const decrypted  = sjcl.decrypt(
                sjcl.codec.hex.toBits(this.key),
                '{"iv":"' + iv + '","v":1,"iter":1000,"ks":256,"ts":128,"mode":"ccm","adata":"","cipher":"aes","salt":"","ct":"' + cypherText + '"}'
            );

            JSON.parse(decrypted).map(element => {
                const key = element.varid;
                if (key.startsWith('dsl_') || key.startsWith('inet_')) {
                    this.values[key] = element.varvalue;
                }
            });

        } catch (exception) {
        }

        return this.values;
    }
}
