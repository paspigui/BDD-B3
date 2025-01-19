const mysql = require("mysql")

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "Exam",
  socketPath:
    process.env.DB_SOCKET_PATH || "/Applications/MAMP/tmp/mysql/mysql.sock",
})

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack)
    process.exit(1)
  }
  console.log("Connected to the database as id " + connection.threadId)
})

module.exports = connection
