var proxy = require('../lib/proxy'),
    should = require('should');

describe('proxy', function(){
    this.timeout(300000);

    describe('setup', function(){
        it('should change the ip, if ENV', function(done){
            if(process.env.PROXYPORT && process.env.PROXYIP){
                proxy.setup()
                    .goto('http://www.whatsmyip.org/')
                    .wait('h1 span')
                    .screenshot('screen/proxy.png')
                    .evaluate(function(){
                        return document.querySelector('h1 span').innerText;
                    }, function(currentIp){
                        currentIp.should.be.equal(process.env.PROXYIP);
                    })
                    .run(done);
            }else{
                done();
            }
        });
    });
});
