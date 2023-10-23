// Include worker threads components so that we can execute multiple build items in parallel
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads")

const esBuildWrapper = require("./esBuildWrapper")
const tscWrapper = require("./tscWrapper")

const threads = new Set()
if (isMainThread) {
  threads.add(new Worker(__filename, { workerData: "tscWrapper" }))
  threads.add(new Worker(__filename, { workerData: "esBuildWrapper" }))
} else {
  console.log(`Running ${workerData}`)
  if (workerData == "tscWrapper") {
    try {
      tscWrapper()
    } catch (e) {
      parentPort.postMessage({ error: e })
    }
  }
  if (workerData == "esBuildWrapper") {
    esBuildWrapper().catch(e => {
      parentPort.postMessage({ error: e })
    })
  }
}

