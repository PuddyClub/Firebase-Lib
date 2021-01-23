module.exports = function (data, type) {
    return new Promise(function (resolve, reject) {

        // Try
        try {

            // Get Data
            require('./getDBAsync')(data, type).then(final_data => {

                // Convert Data
                resolve(require('./getDBValue')(final_data));
                return;

            }).catch(err => {
                reject(err);
                return;
            });

        }

        // Error
        catch (err) { reject(err); }

    });
};