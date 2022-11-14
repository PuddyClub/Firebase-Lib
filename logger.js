// Prepare Log
let logger = null;
const objType = require('@tinypudding/puddy-lib/get/objType');
const clone = require('clone');

// Fix BigInt
const loopInteraction = function (data) {

    // Check Data
    const interaction = {};
    const checkData = function (item) {

        // Checking
        if (objType(data[item], 'object') || Array.isArray(data[item])) {
            interaction[item] = {};
            interaction[item] = loopInteraction(data[item]);
        }

        // BigInt
        else if (objType(data[item], 'bigint')) {
            data[item] = { _type_object: 'BIGINT', value: data[item].toString() };
        }

        // Complete
        return;

    }

    // Data
    if (objType(data, 'object') || Array.isArray(data)) {
        for (const item in data) {
            checkData(item);
        }
    } else {

        // Get BigInt
        if (objType(data, 'bigint')) {
            data = { _type_object: 'BIGINT', value: data.toString() };
        }

    }

    // Complete
    return data;

};

// Module Base
const logBase = async function (type, args) {

    // Production
    if (!require('./isEmulator')()) {

        // Try Get Log
        if (!logger) {
            try {
                logger = require("firebase-functions/logger");
            } catch (err) {
                logger = null;
                console.error('Firebase Logger Module not found or something happened.');
            }
        }

        // Exist Log
        if (logger) {

            for (const item in args) {

                let argData = clone(args[item]);
                loopInteraction(argData);

                if (objType(argData, 'object') || Array.isArray(argData)) {
                    argData = JSON.stringify(argData, null, 2);
                }

            }

            const result = await logger[type].apply(logger, argData);

            return {
                result: result,
                type: 'firebase-functions/logger'
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