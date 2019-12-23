var assert = require('chai').assert;
var AccessLogger = require("../AccessLogger");
var accesses = new AccessLogger(10, 3000);

describe(" test app", function () {


    it("normal check  ", function () {
        var result = accesses.check("127.0.0.1");
        console.log("result:" + JSON.stringify( result));
        assert.isTrue(result.ok);
    });

    it("busy check  ", function () {
        var ip = "127.0.0.2";
        for (var i = 0; i < 10;i++) {
            var result = accesses.check(ip);
            console.log(i + " result:" + JSON.stringify( result));
            assert.isTrue(result.ok);
        }
        var result = accesses.check(ip);
        console.log("fail result:" + JSON.stringify( result));
        assert.isTrue(!result.ok);

    });



}

)