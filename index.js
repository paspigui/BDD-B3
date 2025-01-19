const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")

const PORT = 3001

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Exam",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
})

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack)
    process.exit(1)
  }
  console.log("Connected to the database as id " + connection.threadId)

  initializeDatabase()
})

function initializeDatabase() {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      stock_quantity INT NOT NULL,
      category_id INT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS customers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      customer_id INT,
      order_date DATE NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS order_lines (
      order_id INT,
      product_id INT,
      quantity INT NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      PRIMARY KEY (order_id, product_id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
    `,
  ]

  queries.forEach((query) => {
    connection.query(query, (err) => {
      if (err) {
        console.error("Error creating table:", err.stack)
      } else {
        console.log("Table created or already exists.")
      }
    })
  })
}

const app = express()

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

app.get("/categories", (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err.stack)
      res.status(500).send("Error fetching categories")
    } else {
      res.json(results)
    }
  })
})
app.get("/suppliers", (req, res) => {
  connection.query("SELECT * FROM suppliers", (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err.stack)
      res.status(500).send("Error fetching suppliers")
    } else {
      res.json(results)
    }
  })
})

app.get("/products", (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err.stack)
      res.status(500).send("Error fetching products")
    } else {
      res.json(results)
    }
  })
})

app.get("/customers", (req, res) => {
  connection.query("SELECT * FROM customers", (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err.stack)
      res.status(500).send("Error fetching customers")
    } else {
      res.json(results)
    }
  })
})

app.get("/orders", (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err.stack)
      res.status(500).send("Error fetching orders")
    } else {
      res.json(results)
    }
  })
})

app.get("/order_lines", (req, res) => {
  connection.query("SELECT * FROM order_lines", (err, results) => {
    if (err) {
      console.error("Error fetching order lines:", err.stack)
      res.status(500).send("Error fetching order lines")
    } else {
      res.json(results)
    }
  })
})

app.post("/categories", (req, res) => {
  const { name } = req.body
  connection.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name],
    (err, results) => {
      if (err) {
        console.error("Error creating category:", err.stack)
        res.status(500).send("Error creating category")
      } else {
        res.status(201).send("Category created")
      }
    }
  )
})

app.post("/suppliers", (req, res) => {
  const { name, address, phone, email } = req.body
  connection.query(
    "INSERT INTO suppliers (name, address, phone, email) VALUES (?, ?, ?, ?)",
    [name, address, phone, email],
    (err, results) => {
      if (err) {
        console.error("Error creating supplier:", err.stack)
        res.status(500).send("Error creating supplier")
      } else {
        res.status(201).send("Supplier created")
      }
    }
  )
})

app.post("/products", (req, res) => {
  const { name, unit_price, stock_quantity, category_id } = req.body
  connection.query(
    "INSERT INTO products (name, unit_price, stock_quantity, category_id) VALUES (?, ?, ?, ?)",
    [name, unit_price, stock_quantity, category_id],
    (err, results) => {
      if (err) {
        console.error("Error creating product:", err.stack)
        res.status(500).send("Error creating product")
      } else {
        res.status(201).send("Product created")
      }
    }
  )
})

app.post("/customers", (req, res) => {
  const { name, address, phone, email } = req.body
  connection.query(
    "INSERT INTO customers (name, address, phone, email) VALUES (?, ?, ?, ?)",
    [name, address, phone, email],
    (err, results) => {
      if (err) {
        console.error("Error creating customer:", err.stack)
        res.status(500).send("Error creating customer")
      } else {
        res.status(201).send("Customer created")
      }
    }
  )
})

app.post("/orders", (req, res) => {
  const { customer_id, order_date } = req.body
  connection.query(
    "INSERT INTO orders (customer_id, order_date) VALUES (?, ?)",
    [customer_id, order_date],
    (err, results) => {
      if (err) {
        console.error("Error creating order:", err.stack)
        res.status(500).send("Error creating order")
      } else {
        res.status(201).send("Order created")
      }
    }
  )
})

app.post("/order_lines", (req, res) => {
  const { order_id, product_id, quantity, unit_price } = req.body
  connection.query(
    "INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
    [order_id, product_id, quantity, unit_price],
    (err, results) => {
      if (err) {
        console.error("Error creating order line:", err.stack)
        res.status(500).send("Error creating order line")
      } else {
        res.status(201).send("Order line created")
      }
    }
  )
})

app.delete("/categories/:id", (req, res) => {
  const id = req.params.id
  connection.query(
    "DELETE FROM categories WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting category:", err.stack)
        res.status(500).send("Error deleting category")
      } else {
        res.status(200).send("Category deleted")
      }
    }
  )
})

app.delete("/suppliers/:id", (req, res) => {
  const id = req.params.id
  connection.query(
    "DELETE FROM suppliers WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting supplier:", err.stack)
        res.status(500).send("Error deleting supplier")
      } else {
        res.status(200).send("Supplier deleted")
      }
    }
  )
})

app.delete("/products/:id", (req, res) => {
  const id = req.params.id
  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting product:", err.stack)
        res.status(500).send("Error deleting product")
      } else {
        res.status(200).send("Product deleted")
      }
    }
  )
})

app.delete("/customers/:id", (req, res) => {
  const id = req.params.id
  connection.query(
    "DELETE FROM customers WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error deleting customer:", err.stack)
        res.status(500).send("Error deleting customer")
      } else {
        res.status(200).send("Customer deleted")
      }
    }
  )
})

app.delete("/orders/:id", (req, res) => {
  const id = req.params.id
  connection.query("DELETE FROM orders WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting order:", err.stack)
      res.status(500).send("Error deleting order")
    } else {
      res.status(200).send("Order deleted")
    }
  })
})

app.delete("/order_lines/:order_id/:product_id", (req, res) => {
  const order_id = req.params.order_id
  const product_id = req.params.product_id
  connection.query(
    "DELETE FROM order_lines WHERE order_id = ? AND product_id = ?",
    [order_id, product_id],
    (err, results) => {
      if (err) {
        console.error("Error deleting order line:", err.stack)
        res.status(500).send("Error deleting order line")
      } else {
        res.status(200).send("Order line deleted")
      }
    }
  )
})

app.put("/categories/:id", (req, res) => {
  const id = req.params.id
  const { name } = req.body
  connection.query(
    "UPDATE categories SET name = ? WHERE id = ?",
    [name, id],
    (err, results) => {
      if (err) {
        console.error("Error updating category:", err.stack)
        res.status(500).send("Error updating category")
      } else {
        res.status(200).send("Category updated")
      }
    }
  )
})

app.put("/suppliers/:id", (req, res) => {
  const id = req.params.id
  const { name, address, phone, email } = req.body
  connection.query(
    "UPDATE suppliers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?",
    [name, address, phone, email, id],
    (err, results) => {
      if (err) {
        console.error("Error updating supplier:", err.stack)
        res.status(500).send("Error updating supplier")
      } else {
        res.status(200).send("Supplier updated")
      }
    }
  )
})

app.put("/products/:id", (req, res) => {
  const id = req.params.id
  const { name, unit_price, stock_quantity, category_id } = req.body
  connection.query(
    "UPDATE products SET name = ?, unit_price = ?, stock_quantity = ?, category_id = ? WHERE id = ?",
    [name, unit_price, stock_quantity, category_id, id],
    (err, results) => {
      if (err) {
        console.error("Error updating product:", err.stack)
        res.status(500).send("Error updating product")
      } else {
        res.status(200).send("Product updated")
      }
    }
  )
})

app.put("/customers/:id", (req, res) => {
  const id = req.params.id
  const { name, address, phone, email } = req.body
  connection.query(
    "UPDATE customers SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?",
    [name, address, phone, email, id],
    (err, results) => {
      if (err) {
        console.error("Error updating customer:", err.stack)
        res.status(500).send("Error updating customer")
      } else {
        res.status(200).send("Customer updated")
      }
    }
  )
})

app.put("/orders/:id", (req, res) => {
  const id = req.params.id
  const { customer_id, order_date } = req.body
  connection.query(
    "UPDATE orders SET customer_id = ?, order_date = ? WHERE id = ?",
    [customer_id, order_date, id],
    (err, results) => {
      if (err) {
        console.error("Error updating order:", err.stack)
        res.status(500).send("Error updating order")
      } else {
        res.status(200).send("Order updated")
      }
    }
  )
})

app.put("/order_lines/:order_id/:product_id", (req, res) => {
  const order_id = req.params.order_id
  const product_id = req.params.product_id
  const { quantity, unit_price } = req.body
  connection.query(
    "UPDATE order_lines SET quantity = ?, unit_price = ? WHERE order_id = ? AND product_id = ?",
    [quantity, unit_price, order_id, product_id],
    (err, results) => {
      if (err) {
        console.error("Error updating order line:", err.stack)
        res.status(500).send("Error updating order line")
      } else {
        res.status(200).send("Order line updated")
      }
    }
  )
})
