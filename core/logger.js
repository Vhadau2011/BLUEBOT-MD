const Pino = require("pino")

// Read env safely
const LOG_ENABLED = (process.env.LOG_MESSAGES || "off").toLowerCase() === "on"

// Create logger instance
const logger = Pino({
    level: LOG_ENABLED ? "info" : "silent",
    timestamp: Pino.stdTimeFunctions.isoTime,
    formatters: {
        level(label) {
            return { level: label.toUpperCase() }
        }
    }
})

module.exports = logger
