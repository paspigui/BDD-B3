const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

const initializeDatabase = require("./config/schema")
const PORT = process.env.PORT || 3001
const app = express()
const connection = require("./config/db")

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

initializeDatabase()

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

app.get("/customers/:id/orders", (req, res) => {
  const id = req.params.id
  connection.query(
    "SELECT * FROM orders WHERE customer_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching orders:", err.stack)
        res.status(500).send("Error fetching orders")
      } else {
        res.json(results)
      }
    }
  )
})

app.get("/products/:id/orders", (req, res) => {
  const id = req.params.id
  connection.query(
    "SELECT * FROM orders WHERE id IN (SELECT order_id FROM order_lines WHERE product_id = ?)",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching orders:", err.stack)
        res.status(500).send("Error fetching orders")
      } else {
        res.json(results)
      }
    }
  )
})

app.get("/stats/products", (req, res) => {
  connection.query(
    "SELECT products.name, SUM(order_lines.quantity) AS total_sales FROM products JOIN order_lines ON products.id = order_lines.product_id GROUP BY products.name ORDER BY total_sales DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching stats:", err.stack)
        res.status(500).send("Error fetching stats")
      } else {
        res.json(results)
      }
    }
  )
})
