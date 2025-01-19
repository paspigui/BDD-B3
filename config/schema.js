const connection = require("./db")

const initializeDatabase = () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE
    )`,

    `CREATE TABLE IF NOT EXISTS suppliers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255),
      CONSTRAINT phone_check CHECK (phone REGEXP '^[0-9+\\-() ]*$'),
      CONSTRAINT email_check CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    )`,

    `CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      unit_price DECIMAL(10, 2) NOT NULL,
      stock_quantity INT NOT NULL,
      category_id INT,
      supplier_id INT,
      CONSTRAINT positive_price CHECK (unit_price > 0),
      CONSTRAINT non_negative_stock CHECK (stock_quantity >= 0),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
    )`,

    `CREATE TABLE IF NOT EXISTS customers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255),
      CONSTRAINT customer_phone_check CHECK (phone REGEXP '^[0-9+\\-() ]*$'),
      CONSTRAINT customer_email_check CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    )`,

    `CREATE TABLE IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      customer_id INT NOT NULL,
      order_date DATETIME DEFAULT NOW(),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS order_lines (
      order_id INT,
      product_id INT,
      quantity INT NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      CONSTRAINT positive_quantity CHECK (quantity > 0),
      CONSTRAINT positive_line_price CHECK (unit_price > 0),
      PRIMARY KEY (order_id, product_id),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`,

    `CREATE TRIGGER check_stock_before_insert
     BEFORE INSERT ON order_lines
     FOR EACH ROW
     BEGIN
       DECLARE available_stock INT;
       SELECT stock_quantity INTO available_stock FROM products WHERE id = NEW.product_id;
       IF available_stock < NEW.quantity THEN
         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuffisant pour ce produit';
       END IF;
     END`,

    `CREATE TRIGGER update_stock_after_insert
     AFTER INSERT ON order_lines
     FOR EACH ROW
     BEGIN
       UPDATE products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;
     END`,

    `CREATE TRIGGER restore_stock_after_delete
     AFTER DELETE ON order_lines
     FOR EACH ROW
     BEGIN
       UPDATE products SET stock_quantity = stock_quantity + OLD.quantity WHERE id = OLD.product_id;
     END`,
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

module.exports = initializeDatabase
