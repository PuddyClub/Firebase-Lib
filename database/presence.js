module.exports = () => {

    // Modules
    const requireOptional = require('@tinypudding/puddy-lib/get/module')
    const moment = requireOptional('moment-timezone');

    // Since I can connect from multiple devices or browser tabs, we store each connection instance separately
    // any time that connectionsRef's value is null (i.e. has no children) I am offline
    var myConnectionsRef = bot.firebase.db.main.child('dsjs/connections');

    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = bot.firebase.db.main.child('dsjs/lastOnline');

    var connectedRef = bot.firebase.db.root.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {

            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            var con = myConnectionsRef.push();

            // When I disconnect, remove this device
            con.onDisconnect().remove((err) => {
                if (err) {
                    console.group("could not establish onDisconnect event");
                    console.error(err);
                    console.groupEnd();
                }
            });

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            con.set(true);

            // When I disconnect, update the last time I was seen online
            let momentTime;
            if (moment) { momentTime = moment.utc().toObject(); } else {

                const date = new Date();
                momentTime = {
                    date: date.getUTCDate(),
                    hours: date.getUTCHours(),
                    milliseconds: date.getUTCMilliseconds(),
                    minutes: date.getUTCMinutes(),
                    months: date.getUTCMonth(),
                    seconds: date.getUTCSeconds(),
                    years: date.getUTCFullYear()
                };

            }
            momentTime.timezone = 'Universal';
            lastOnlineRef.onDisconnect().set(momentTime);

        }
    });

};