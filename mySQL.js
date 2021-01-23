module.exports = function (mysql, databases, cfg) {
    return new Promise(function (resolve, reject) {

        // Get Module
        try {
            require('@tinypudding/mysql-connector').create(mysql, databases, cfg, 'firebase').then(data => {
                resolve(data);
                return;
            }).catch(err => {
                reject(err);
                return;
            });
        }

        // Error
        catch (err) {
            reject(err);
        }

        // Complete
        return;

    });
};