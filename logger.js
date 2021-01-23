// Prepare Log
let logger = null;

// Module Base
const logBase = function (type, args) {

    // Production
    if (!require('./isEmulator')()) {

        // Try Get Log
        if (!logger) {
            try {
                logger = require("firebase-functions/lib/logger");
            } catch (err) {
                logger = null;
                console.error(err);
            }
        }

        // Exist Log
        if (logger) {
            return {
                result: logger[type].apply(logger, args),
                type: 'firebase-functions/lib/logger'
            };
        }

        // Nope
        else {
            return {
                result: console[type].apply(console, args),
                type: 'console/javascript-vanilla'
            };
        }

    }

    // Nope
    else {
        return {
            result: console[type].apply(console, args),
            type: 'console/javascript-vanilla'
        };
    }

};

// Module
module.exports = {

    // Log
    log: function () { return logBase('log', arguments); },

    // Info
    info: function () { return logBase('info', arguments); },

    // Warn
    warn: function () { return logBase('warn', arguments); },

    // Error
    error: function () { return logBase('error', arguments); },

};