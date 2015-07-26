var proxy = exports = module.exports = {},
    Nightmare = require('nightmare');


proxy.setup = function(options){
    options = options || {};
    if(process.env.PROXYPORT && process.env.PROXYIP){
        options.proxy = process.env.PROXYIP +':' + process.env.PROXYPORT;
    }
    return Nightmare(options);
};
