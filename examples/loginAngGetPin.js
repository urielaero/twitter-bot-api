var Nightmare = require('nightmare');
    twitter = require('../lib/twitter');

var email = process.env.TWITTERMAIL,
    password = process.env.TWITTERPASSWORD,
    authorizeUrl = 'https://twitter.com/oauth/authorize?oauth_token=DikOIQAAAAAAReflAAABTsxxpHk';

twitter.loginAndGetPin(
    email,
    password,
    authorizeUrl,
    true, //notify
    function(err, code){
        console.log('succes code', err, code);
    }
);
