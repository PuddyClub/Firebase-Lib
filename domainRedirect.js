// https://stackoverflow.com/questions/34212039/redirect-to-firebase-hosting-custom-domain
module.exports = function (domains = ['localhost:5000', 'example.com'], baseurl = 'https://example.com/') {
    return (req, res, next) => {
        if (!domains.includes(req.headers['x-forwarded-host'])) {
            return res.status(301).redirect(url.resolve(baseurl, req.path.replace(/^\/+/, "")));
        }
        return next();
    };
};