module.exports = function (mysql, databases, cfg) {
    return new Promise(function (resolve, reject) {

        // Get Module
        try {
            return require('@tinypudding/mysql-connector').create(mysql, databases, cfg, 'firebase');
        }

        // Error
        catch (err) {

        }

    });
};