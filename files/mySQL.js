module.exports = function (mysql, databases, cfg) {
    return require('../libs/mySQL')(mysql, databases, cfg, 'firebase');
};