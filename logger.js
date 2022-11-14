// Prepare Log
let logger = null;
const objType = require('@tinypudding/puddy-lib/get/objType');

// Fix BigInt
const loopInteraction = async function (data) {

    // Check Data
    const interaction = {};
    const checkData = async function (item, itemData) {

        // Checking
        if (objType(itemData, 'object') || Array.isArray(itemData)) {
            interaction[item] = {};
            interaction[item] = await loopInteraction(itemData);
        } 
        
        // BigInt
        else if (objType(itemData, 'bigint')) {
            data[item] = { _type_object: 'BIGINT', value: itemData.toString() };
        }

        // Complete
        return;

    }

    // Data
    if (objType(data, 'object') || Array.isArray(data)) {
        for (const item in data) {
            await checkData(item, data[item]);
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

            await loopInteraction(args);
            const result = await logger[type].apply(logger, args);
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