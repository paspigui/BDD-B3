const mysql = require("mysql")

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET_PATH,
})

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack)
    process.exit(1)
  }
  console.log("Connected to the database as id " + connection.threadId)
})

module.exports = connection
