var twitter = require('../lib/twitter'),
    should = require('should');

describe('twitter', function(){

    describe('randSelector', function(){
        it('should generate random selector', function(){
            var selector = twitter.randSelector('.suggestions ul', 'li', 5);
            selector.should.containEql('.suggestions ul li');
        });
    });

});
