var request = require("request");
var express = require("express");
var User = require("../app/models/User");
var base_url = "http://localhost:8080";

describe("testing HTTP requests", function() {

    describe("GET /", function() {

        it("returns status code 200", function() {
            request.get(base_url, function(err, res, body) {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it("sends the right file", function() {
            request.get(base_url, function(err, res, body) {
                spyOn(express, "sendFile");
                expect(express.sendFile).toHaveBeenCalledWith("../public/kirby.html");
                done();
            });
        })
    });

    describe("POST /", function() {

        var score = {
            userId: "Annie",
            highScore: 0
        };

        it("returns status code 200", function() {
            request.post(base_url, score, function(err, res, body) {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        it("adds a new document to the User collection", function() {
            request.post(base_url, score, function(err, res, body) {
                spyOn(User, "save");
                expect(User.save).toHaveBeenCalled();
                done();
            });
        });

    });

});

describe("testing User model", function() {

    describe("save", function() {

        it("should throw an error when User document does not have proper format", function() {
            var newUser = new User();
            newUser.validate(function(err) {
                expect(err.errors.userId).toBeDefined();
                done();
            });
        });

    });

});