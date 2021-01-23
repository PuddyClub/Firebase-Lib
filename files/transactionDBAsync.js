module.exports = async function (data, callback) {
    return Promise(async function (resolve, reject) {

        // Try
        try {

            // The Transaction
            const result = await data.transaction(function (current_value) {
                return callback(current_value);
            }, function (errorObject) {
                reject(errorObject);
            });
            resolve(result);

        }

        // Error
        catch (err) { reject(err); }

        // Return
        return;

    });
};