"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalDatabase = void 0;
const Database_1 = require("./Database");
const sql_js_1 = __importDefault(require("sql.js"));
const Thing_js_1 = require("./Model/Thing.js");
const typeorm_1 = require("typeorm");
const sqlConfiguration = { locateFile: (filename) => `https://sql.js.org/dist/${filename}` };
class LocalDatabase extends Database_1.Database {
    db;
    static EntityRegistry = [typeof Thing_js_1.Thing];
    static initializing = false;
    static initialized = false;
    static instance;
    DataSource;
    static get Instance() {
        if (!this.instance) {
            if (!this.initialized) {
                console.warn("LocalDatabase not initialized");
                this.initialize().then(() => { console.log("LocalDatabase initialized"); });
            }
            this.instance = new LocalDatabase();
        }
        return this.instance;
    }
    constructor() {
        super();
    }
    static async initialize() {
        if (this.initializing) {
            return;
        }
        this.initializing = true;
        let SQL = await (0, sql_js_1.default)(sqlConfiguration);
        this.instance = new LocalDatabase();
        this.instance.db = new SQL.Database();
        // Connect TypeORM to the database
        this.instance.DataSource = new typeorm_1.DataSource({
            type: "sqljs",
            location: "browser",
            // database: this.instance.db,
            synchronize: true,
            logging: true,
            entities: LocalDatabase.EntityRegistry
        });
        this.initializing = false;
        this.initialized = true;
    }
    async FindAll(entity) {
        if (!this.DataSource) {
            throw new Error("DataSource not set");
        }
        return this.DataSource.manager.find(entity);
    }
    async FindById(entity, id) {
        if (!this.DataSource) {
            throw new Error("DataSource not set");
        }
        return this.DataSource.manager.findOne(entity, { id });
    }
    async Save(entity) {
        if (!this.DataSource) {
            throw new Error("DataSource not set");
        }
        return this.DataSource.manager.save(entity);
    }
    async Delete(entity) {
        if (!this.DataSource) {
            throw new Error("DataSource not set");
        }
        return this.DataSource.manager.remove(entity);
    }
}
exports.LocalDatabase = LocalDatabase;
//# sourceMappingURL=LocalDatabase.js.map