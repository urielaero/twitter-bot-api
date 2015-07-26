var notifier = require('node-notifier'),
    Nightmare = require('nightmare'),
    proxy = require('./proxy'),
    twitter = exports = module.exports = {},
    urlRegister = 'https://twitter.com/signup',
    urlLogin = 'https://twitter.com/';

//plugins from Nightmare:

var plugin = twitter.plugin = {};

plugin.register = function(name, email, pwd, username, done){
    return function(nightmare){
        var recomend = {
            select: '',
            username: username
        };
        nightmare
            .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
            //.goto(urlRegister)
            .goto('https://twitter.com/')
                .wait(2000)
                .wait('.signup-btn')
                .click('.signup-btn')
                .wait(2000)
                .wait('#full-name')
                .type('#full-name', name)
                .type('#email', email)
                .type('#password', pwd)
                .type('#username', username)
                .wait('.suggestions')
                .screenshot('screen/register/suggestions.png')
                .evaluate(function(){
                    return $('.suggestions ul li').size();
                }, function(suggestionCount){
                    if(suggestionCount){
                        recomend.select = twitter.randSelector('.suggestions ul', 'li', suggestionCount);
                    }else{
                        recomend.select == false;
                    }
                    //console.log('Recomend', recomend);
                })
                .evaluate(function(recomend){
                    if(recomend.select == false){
                        return recomend.username;
                    }
                    var selector = recomend.select + ' button';
                    var element = document.querySelector(selector);
                    var event = document.createEvent('MouseEvent');
                    event.initEvent('click', true, true);
                    element.dispatchEvent(event);
                    return element.textContent;
                }, function(user){
                    recomend.username = user;
                    //console.log('data', recomend);
                }, recomend)
                .wait(function(){
                    return document.querySelectorAll('.ok.active').length + document.querySelectorAll('.domain.active').length;
                }, 4)
                .screenshot('screen/register/ifSugestionCheck.png')
                .click('#submit_button')
                .wait(2000)
                .wait('.skip-link')//skip phone number
                .evaluate(function(){
                    return document.querySelectorAll('.skip-link').length ? true : false;
                }, function(exist){//if exist fine! else BLOCKED by ip.
                    if(done){
                        if(!exist)
                            return done(new Error('failed maybe phone number is required'));

                        done(null, {
                            email: email,
                            password: pwd,
                            username: recomend.username
                        });
                    }
                })
                .screenshot('screen/register/success.png')
                .click('.skip-link')
                .wait(2000)
                .wait('.btn')
                .screenshot('screen/register/step1.png')
                .click('.btn')
                .wait(2000)
                .wait('.btn')
                .screenshot('screen/register/step2.png')
                .click('.btn.primary-btn')
                .wait(2000)
                //.wait('.js-skip-step')
                .wait('.btn-follow-all')
                .screenshot('screen/register/step3.png')
                //.click('.js-skip-step')
                .click('.btn-follow-all')
                .wait(9000)
                .wait('.DashboardProfileCard-bg')
                .screenshot('screen/register/finish.png')

    };
};

plugin.login = function(email, pwd, notify){
    return function(nightmare){
        nightmare
            .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
            .goto('https://twitter.com/')
            .wait('.front-welcome-text')
            .type('#signin-email', email)
            .type('#signin-password', pwd)
            .click('button.btn.js-submit')
            .wait(2000)
            .wait('.DashboardProfileCard-stats')
            .use(showNotify(notify))
    };
};

plugin.getPinNumber = function(url, notify, onSuccesCode){
    if(!onSuccesCode){
        onSuccesCode = notify;
        notify = false;
    }

    return function(nightmare){
        nightmare
            //.useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
            .goto(url)
            .wait(2000)
            .wait('#allow')
            .screenshot('screen/loginAndGetPin/allow.png')
            .click('#allow')
            .wait(3000)
            .wait('code')
            .screenshot('screen/loginAndGetPin/code.png')
            .evaluate(function(){
                    return document.querySelector('code').innerText;
                },function(code){
                    if(onSuccesCode){
                        if(!code)
                            return onSuccesCode(new Error('Code not found'));
                        onSuccesCode(null, code);
                    }
                }
            )
            .use(showNotify(notify))

    };

};

plugin.tweet = function(tweet, notify){
    //not work :/
    return function(nightmare){
        nightmare
            .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')
            .goto('https://twitter.com/')
            .wait('#global-new-tweet-button')
            .wait(2000)
            .click('#global-new-tweet-button')
            .evaluate(function(){
                    $('#global-new-tweet-button').click();
                    return $('#global-new-tweet-button').text();
                }, function(display){
                    console.log(display);
                })
            .wait(2000)
            .wait(function(){
                return document.querySelector('#global-tweet-dialog').style.display;
            },'block')
            .screenshot('screen/modal.png')
            .type('#tweet-box-global', tweet)
            .screenshot('screen/typetweet.png')
            .wait(2000)
            .wait('#global-tweet-dialog .tweet-button button')
            .click('#global-tweet-dialog .tweet-button button')
            .wait(2000)
            .screenshot('screen/tweet.png')
            .use(showNotify(notify))
    };
};

//utils

twitter.randSelector = function(root, child, max){
    var rand = getRandomInt(1, max),
        selector = root + ' ',
        childs = []
    for(var i=0; i < rand; i++)
        childs.push(child);
    selector += childs.join(' + ');
    return selector;
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showNotify(active, msg){
    return function(nightmare){
        msg = msg || {
                        'title': 'Nightmare',
                        'message': 'Success!'
                    };
        if(active){
            notifier.notify(msg);
        }

    };
}

plugin.notify = function(active, msg){ //dafault true
    active = active === false ? false : true;
    return showNotify(active, msg);
};

//Api

twitter.loginAndGetPin = function(email, pwd, url, notify, done){
    if(!done){
        done = notify;
        notify = false;
    }
    new Nightmare()
        .use(plugin.login(email, pwd))
        .use(plugin.getPinNumber(url, notify, done))
        .run();

};

twitter.register = function(name, email, pwd, username, done){
    new Nightmare()
        .use(plugin.register(name, email, pwd, username, done))
        .run();
};
