// https://stackoverflow.com/questions/34212039/redirect-to-firebase-hosting-custom-domain
module.exports = function (domains = ['localhost:5000', 'example.com'], baseurl = 'https://example.com/', callback) {
    return (req, res, next) => {

        // Invalid Domain Detected
        if (!domains.includes(req.headers['x-forwarded-host'])) {

            if (typeof callback !== "function") {
                return res.status(301).redirect(baseurl + req.url);
            }

        }

        // Complete
        return next();

    };
};