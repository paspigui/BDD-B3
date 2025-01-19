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
    `
    INSERT INTO categories (name) VALUES
    ('Jets'), ('Avions de ligne'), ('Avions militaires'), ('Drones')
    `,
    `
    INSERT INTO suppliers (name, address, phone, email) VALUES
    ('PaperCraft Supplies', '123 Rue des Papiers, Paris', '0145567890', 'contact@papercraft.com'),
    ('AirPaper Ltd.', '45 Aviation Street, London', '00442012345678', 'info@airpaper.co.uk'),
    ('Origami Experts', '12 Sakura Blvd, Tokyo', '+81345678912', 'support@origamiexperts.jp'),
    ('FoldedWings', '99 Paper Drive, New York', '+12124567890', 'info@foldedwings.us'),
    ('SkyFold Creations', '88 Main Road, Sydney', '+61234567890', 'contact@skyfold.com'),
    ('Crafting Aces', '22 Pioneer Lane, Toronto', '+14165551234', 'hello@craftingaces.ca'),
    ('AirArt Papers', '10 Rue de la Création, Lyon', '0478234567', 'sales@airartpapers.fr'),
    ('FlightForm Supplies', '77 Aviation Way, Berlin', '+493012345678', 'support@flightform.de'),
    ('Wings of Paper', '5 Starlight Ave, Dublin', '+35314567890', 'info@wingsofpaper.ie'),
    ('PaperFly Ltd.', '120 Craft Boulevard, Brussels', '+32212345678', 'sales@paperfly.be'),
    ('GlidePaper Inc.', '11 Glide Street, Amsterdam', '+31204567890', 'contact@glidepaper.nl'),
    ('MasterFolds', '13 Fold Lane, Rome', '+390612345678', 'support@masterfolds.it'),
    ('AirFlow Creations', '9 Stream Road, Barcelona', '+349312345678', 'info@airflowcreations.es'),
    ('SharpWings', '56 Edge Street, Vienna', '+43123456789', 'contact@sharpwings.at'),
    ('AeroFold Supplies', '3 Flight Avenue, Zurich', '+414512345678', 'support@aerofold.ch'),
    ('Precision Papers', '33 Craft Street, Brussels', '+32267890123', 'info@precisionpapers.be'),
    ('SkyCraft Papers', '44 Foldway Road, Helsinki', '+358123456789', 'contact@skycraftpapers.fi'),
    ('PaperInnovations', '88 Designer Way, Oslo', '+472312345678', 'info@paperinnovations.no'),
    ('CraftElite', '101 Elite Lane, Stockholm', '+468123456789', 'support@craftelite.se'),
    ('PrimeFold Papers', '15 Premium Street, Copenhagen', '+453456789123', 'sales@primefold.dk');
    `,
    `
    INSERT INTO products (name, unit_price, stock_quantity, category_id) VALUES
    ('Jet en papier classique', 9.99, 100, 1),
    ('Jet supersonique en papier', 14.99, 80, 1),
    ('Avion de ligne A380 en papier', 19.99, 60, 2),
    ('Avion militaire F-16 en papier', 15.99, 50, 3),
    ('Avion furtif en papier', 24.99, 30, 3),
    ('Drone en papier modèle X', 12.99, 70, 4),
    ('Avion de ligne B747 en papier', 18.99, 40, 2),
    ('Avion militaire Rafale en papier', 17.99, 35, 3),
    ('Drone rapide modèle Y', 13.99, 90, 4),
    ('Hydravion classique', 16.99, 20, 2),
    ('Mini-jet pliant', 8.99, 100, 1),
    ('Avion de chasse Typhoon en papier', 21.99, 25, 3),
    ('Planeur en papier modèle Alpha', 10.99, 60, 1),
    ('Avion de ligne Concorde en papier', 22.99, 15, 2),
    ('Avion militaire Mig-29 en papier', 19.99, 30, 3),
    ('Avion furtif modèle Stealth X', 26.99, 10, 3),
    ('Drone de reconnaissance modèle Z', 15.99, 40, 4),
    ('Avion pliant rapide modèle Swift', 7.99, 120, 1),
    ('Planeur long-courrier', 12.49, 50, 1),
    ('Avion de ligne Embraer en papier', 16.49, 35, 2);
    `,
    `
    INSERT INTO customers (name, address, phone, email) VALUES
    ('Jean Dupont', '15 Rue de la Liberté, Lyon', '0478561234', 'jean.dupont@mail.com'),
    ('Alice Martin', '23 Avenue des Alpes, Annecy', '0450627891', 'alice.martin@mail.com'),
    ('Marc Leroy', '5 Boulevard Haussmann, Paris', '0165782345', 'marc.leroy@mail.com'),
    ('Sophie Bernard', '78 Chemin des Écoles, Lille', '0320456789', 'sophie.bernard@mail.com'),
    ('Paul Girard', '10 Allée des Fleurs, Nantes', '0240567891', 'paul.girard@mail.com'),
    ('Emma Morel', '89 Avenue des Champs, Bordeaux', '0556789012', 'emma.morel@mail.com'),
    ('Lucas Fabre', '34 Rue des Hirondelles, Marseille', '0490123456', 'lucas.fabre@mail.com'),
    ('Chloé Renault', '67 Rue des Ajoncs, Nice', '0493567890', 'chloe.renault@mail.com'),
    ('Nathan Caron', '12 Rue des Lilas, Grenoble', '0470891234', 'nathan.caron@mail.com'),
    ('Camille Roussel', '18 Boulevard Saint-Michel, Paris', '0167345678', 'camille.roussel@mail.com'),
    ('Hugo Lefèvre', '3 Rue de la Gare, Toulouse', '0561783456', 'hugo.lefevre@mail.com'),
    ('Manon Dubois', '99 Boulevard Pasteur, Lyon', '0478256890', 'manon.dubois@mail.com'),
    ('Clément Petit', '45 Avenue Carnot, Rennes', '0290123456', 'clement.petit@mail.com'),
    ('Julie Garnier', '21 Rue de l’Église, Strasbourg', '0388123456', 'julie.garnier@mail.com'),
    ('Théo Blanc', '14 Rue des Pins, Montpellier', '0467456789', 'theo.blanc@mail.com'),
    ('Louise Noël', '30 Rue du Parc, Dijon', '0380567891', 'louise.noel@mail.com'),
    ('Maxime Lambert', '77 Rue des Sapins, Limoges', '0554789012', 'maxime.lambert@mail.com'),
    ('Clara Fontaine', '54 Boulevard de la République, Orléans', '0241123456', 'clara.fontaine@mail.com'),
    ('Antoine Durand', '22 Rue des Rosiers, Le Havre', '0238456789', 'antoine.durand@mail.com'),
    ('Léa Moreau', '9 Rue Victor Hugo, Tours', '0240567890', 'lea.moreau@mail.com');
    `,
    `
    INSERT INTO orders (customer_id, order_date) VALUES
    (1, '2025-01-01'), (2, '2025-01-02'), (3, '2025-01-05'), (4, '2025-01-06'),
    (5, '2025-01-07'), (6, '2025-01-08'), (7, '2025-01-09'), (8, '2025-01-10'),
    (9, '2025-01-11'), (10, '2025-01-12'), (11, '2025-01-13'), (12, '2025-01-14'),
    (13, '2025-01-15'), (14, '2025-01-16'), (15, '2025-01-17'), (16, '2025-01-18'),
    (17, '2025-01-19'), (18, '2025-01-20'), (19, '2025-01-21'), (20, '2025-01-22');

    `,
    `
    INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 3, 9.99), (1, 3, 1, 19.99), (2, 2, 2, 14.99), (2, 5, 1, 24.99),
    (3, 4, 2, 15.99), (3, 6, 1, 18.99), (4, 7, 4, 12.99), (4, 8, 1, 17.99),
    (5, 10, 3, 16.99), (6, 12, 2, 21.99), (7, 14, 1, 22.99), (8, 9, 2, 13.99),
    (9, 16, 1, 26.99), (10, 18, 5, 7.99), (11, 20, 2, 16.49), (12, 11, 1, 8.99),
    (13, 15, 2, 19.99), (14, 17, 3, 12.49), (15, 19, 1, 10.99), (16, 13, 4, 10.99);

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
