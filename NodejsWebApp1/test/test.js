var assert = require('chai').assert;
var AccessLogger = require("../AccessLogger");
var accesses = new AccessLogger(10, 3000);

describe(" test app", function () {


    it("normal check  ", function () {
        var result = accesses.check("127.0.0.1");
        console.log("result:" + result);
        assert.isTrue(result);
    });

    it("busy check  ", function () {
        var ip = "127.0.0.2";
        for (var i = 0; i < 10;i++) {
            var result = accesses.check(ip);
            console.log(i+" result:" + result);
            assert.isTrue(result);
        }
        var result = accesses.check(ip);
        console.log("fail result:" + result);
        assert.isTrue(!result);

    });



}

)