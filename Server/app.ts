const readFile = require("fs").promises.readFile
const express = require("express") as typeof import("express")
const join = require("path").join
const resolve = require("path").resolve
const nodemon = require("nodemon")

const api = require("./Api/api")

//import express from "express"
//import { join } from "path"

const app = express()
const PORT = process.env.PORT || 8082
const localFiles = resolve(process.cwd(), "..", "Editor", "dist")

app.use(express.static(localFiles))

app.listen(PORT, () => {
  console.table({ Application: "Deacon:Editor", URL: `http://localhost:${PORT}` })
})

app.get("/", async (req: any, res: any) => {
  // return contents of index.html
  let root = resolve(process.cwd(), "..", "Shared", "HTML")
  let data = await readFile(join(root, "index.html"), "utf8")
  res.send(data)
  res.end()
})

// Configure nodemon to watch ../Editor for changes and do `npm run build` in that directory
nodemon({
  exec: "cd ../Editor && npm run build",
  watch: "../Editor",
  ext: "ts",
  delay: "2500"
})
