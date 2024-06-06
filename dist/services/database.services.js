"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@samurai.brgwcpm.mongodb.net/`;
class DatabaseService {
    client;
    db;
    constructor() {
        this.client = new mongodb_1.MongoClient(uri);
        this.db = this.client.db(process.env.DB_NAME);
    }
    async connect() {
        try {
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        }
        catch (error) {
            console.log('Error', error);
            throw error;
        }
    }
    get users() {
        return this.db.collection(process.env.DB_COLLECTION_USER);
    }
    get refreshTokens() {
        return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS);
    }
    get categories() {
        return this.db.collection(process.env.DB_COLLECTION_CATEGORIES);
    }
    get products() {
        return this.db.collection(process.env.DB_COLLECTION_PRODUCTS);
    }
}
const databaseService = new DatabaseService();
exports.default = databaseService;
