"use strict";
module.exports = function(app) {
    const { userController } = require("./src/controllers");
    app.post("/register", userController.register);
    app.post("/sign-in", userController.signIn);
};