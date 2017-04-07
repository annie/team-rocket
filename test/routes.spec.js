var request = require("request");
var base_url = "http://localhost:8080";

describe("routes test", function() {

    describe("GET /", function() {

        it("returns status code 200", function() {
            request.get(base_url, function(err, res, body) {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

    });

});