"user stric";
const UserSchema = require("../schema/user.schema");
const { MongoClient } = require("mongodb");
const MESSAGE = require("../constant/message");
const Validator = require("jsonschema").Validator,
    schemaValidator = new Validator(),
    jwt = require("jsonwebtoken"),
    bcrypt = require("bcrypt");

const User = require("../models/user.models");
const { query } = require("express");

class UserManager {
    constructor() {}

    async saveUser(userData) {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
            // If results.errors is an empty array, then this validated successfully.
            var validationResult = schemaValidator.validate(userData, UserSchema);
            if (validationResult.valid) {
                await client.connect();
                console.log("Connected correctly to server");
                const dbName = "company_db";
                const db = client.db(dbName);
                // Use the collection
                const conn = db.collection("users");
                userData.password = bcrypt.hashSync(userData.password, 10);

                await conn.insertOne(userData);
            } else {
                throw new ValidationError(
                    MESSAGE.VALIDATION_ERROR,
                    validationResult.errors
                );
            }
        } catch (error) {
            throw error;
        } finally {
            // Close mongodb connection
            await client.close();
        }
    }

    async signIn(param) {
        try {
            const user = await this.findOne(param.email_id);
            if (!user) {
                throw new Error("No user with that email");
            }
            const isValid = await bcrypt.compare(param.password, user.password);
            if (!isValid) {
                throw new Error("Incorrect password");
            }
            return {
                token: jwt.sign({
                        email_id: user.email_id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        address: user.address,
                        mobile_no: user.mobile_no,
                        _id: user._id,
                    },
                    "RESTFULAPIs"
                ),
            };
        } catch (error) {
            throw error;
        }
    }

    async findOne(email) {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
            await client.connect();
            console.log("Connected correctly to server");
            const dbName = "company_db";
            const db = client.db(dbName);
            // Use the collection
            const conn = db.collection("users");
            return await conn.findOne({
                email_id: email,
            });
        } catch (error) {
            throw error;
        } finally {
            // Close mongodb connection
            await client.close();
        }
    }

    async find(query) {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
            await client.connect();
            console.log("Connected correctly to server");
            const dbName = "company_db";
            const db = client.db(dbName);
            // Use the collection
            const conn = db.collection("users");
            return await conn.find({ query });
        } catch (error) {
            throw error;
        } finally {
            // Close mongodb connection
            await client.close();
        }
    }

    async update(userData, email) {
        const uri = process.env.MONGO_URI;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        try {
            await client.connect();
            console.log("Connected correctly to server");
            const dbName = "company_db";
            const db = client.db(dbName);
            // Use the collection
            const conn = db.collection("users");
            if (userData.password) {
                userData.password = bcrypt.hashSync(userData.password, 10);
            }
            await conn.updateOne({ email_id: email }, { $set: userData }, { upsert: true });
        } catch (error) {
            throw error;
        } finally {
            // Close mongodb connection
            await client.close();
        }
    }
}

module.exports = UserManager;