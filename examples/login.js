var Nightmare = require('nightmare');
    twitter = require('../lib/twitter').plugin;

var email = process.env.TWITTERMAIL,
    password = process.env.TWITTERPASSWORD;

new Nightmare()
    .use(twitter.login(email, password))
    .screenshot('screen/login/cap.png')
    .use(twitter.notify(true, {
                        'title': 'Nightmare',
                        'message': 'Login Success!'
                    }
    ))
    .run();
