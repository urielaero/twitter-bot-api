var Nightmare = require('nightmare'),
    twitter = require('../lib/twitter');


var name = 'cool bot',
    email = 'g7655087@trbvm.com',
    password = 'iuhodleug',
    username = 'nicebot';

twitter.register(name, email, password, username, function(err, user){
    console.log('done', err, user);
    twitter.plugin.notify()();
});
