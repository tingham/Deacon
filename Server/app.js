"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readFile = require("fs").promises.readFile;
const express = require("express");
const join = require("path").join;
const resolve = require("path").resolve;
const nodemon = require("nodemon");
let v = { id: "BOB" };
console.log(v);
//import express from "express"
//import { join } from "path"
const app = express();
const PORT = process.env.PORT || 8082;
const localFiles = resolve(process.cwd(), "..", "Editor", "dist");
app.use(express.static(localFiles));
app.listen(PORT, () => {
    console.table({ Application: "Deacon:Editor", URL: `http://localhost:${PORT}` });
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // return contents of index.html
    let root = resolve(process.cwd(), "..", "Shared", "HTML");
    let data = yield readFile(join(root, "index.html"), "utf8");
    res.send(data);
    res.end();
}));
// Configure nodemon to watch ../Editor for changes and do `npm run build` in that directory
nodemon({
    exec: "cd ../Editor && npm run build",
    watch: "../Editor",
    ext: "ts",
    delay: "2500"
});
//# sourceMappingURL=app.js.map