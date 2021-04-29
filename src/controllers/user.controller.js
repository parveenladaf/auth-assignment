"use strict";

const UserManager = require("../biz/user.manager");

const STATUS = require("../constant/status");
const HEADER = require("../constant/header");
const User = require("../models/user.models"),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt");
const MESSAGE = require("../constant/message");

/**
 * Authentication Controller for handling login.
 */
class UserController {
    /**
     * default constructor
     */
    constructor() {}

    async register(req, res) {
        try {
            const userManager = new UserManager();
            const findUser = await userManager.findOne(req.body.email_id);
            if (!findUser) {
                await userManager.saveUser(req.body);
                res
                    .status(STATUS.OK)
                    .header(HEADER.CONTENT_TYPE, HEADER.JSON)
                    .send(MESSAGE.USER);
            } else {
                res
                    .status(STATUS.OK)
                    .header(HEADER.CONTENT_TYPE, HEADER.JSON)
                    .send(MESSAGE.USER_EXIST + " " + findUser.email_id);
            }
        } catch (err) {
            res.status(err.status || STATUS.ERROR).send(err);
        }
    }
    async signIn(req, res) {
        try {
            const userManager = new UserManager();
            const result = await userManager.signIn(req.body);
            res
                .status(STATUS.OK)
                .header(HEADER.CONTENT_TYPE, HEADER.JSON)
                .send(JSON.stringify(result));
        } catch (err) {
            res.status(err.status || STATUS.ERROR).send("Internal Server Error");
        }
    }
}

module.exports = UserController;