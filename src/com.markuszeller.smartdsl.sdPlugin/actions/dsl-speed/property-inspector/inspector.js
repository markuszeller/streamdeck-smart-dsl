$PI.onConnected((jsn) => {
    const form = document.querySelector('#property-inspector');
    const {actionInfo, appInfo, connection, messageType, port, uuid} = jsn;
    const {payload, context} = actionInfo;
    const {settings} = payload;

    Utils.setFormValue(settings, form);

    form.addEventListener(
        'input',
        Utils.debounce(150, () => {
            const value = Utils.getFormValue(form);
            $PI.setSettings(value);
        })
    );

    console.log("Property Inspector connected");
});

$PI.onSendToPropertyInspector(action, (payload) => {
   console.log(payload);
   document.getElementById('unit_radio1').style.border = '1px solid white';
});

document.getElementById('router-ip').style.border = '1px solid white';
