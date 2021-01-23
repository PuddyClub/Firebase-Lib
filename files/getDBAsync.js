module.exports = function (data, type = 'value') {
    return new Promise(function (resolve, reject) {

        // Try
        try {

            // Run Data
            data.once(type, function (snapshot) {
                resolve(snapshot);
            }, function (errorObject) {
                reject(errorObject);
            });

        }

        // Error
        catch (err) { reject(err); }

    });
};