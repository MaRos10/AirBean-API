import db from "../db/database.js";
import menu from "../services/menu.js";

// Function to move data from menu.js to menu.db
async function clearMenu() {
  try {
    // Removes all objects from menu.db
    await db.menu.remove({}, { multi: true });
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}
async function moveData() {
  try {
    await clearMenu();
    // Loop through each item in menu
    for (const menuItem of menu) {
      // Insert item into menu.db
      await db.menu.insert(menuItem);
    }
    console.log("Data moved successfully from menu.js to menu.db");
  } catch (error) {
    console.error("Error moving data from menu.js to menu.db:", error);
  }
}

moveData();

// Userobject for admin
const adminUser = {
  username: "admin",
  password: "password",
  role: "admin",
};

// Check if admin-user already exists
db.admin
  .findOne({ username: adminUser.username })
  .then((user) => {
    if (!user) {
      // If admin-user doesn´t exist
      return db.admin.insert(adminUser).then(() => {
        console.log("Admin user added successfully to admin.db");
      });
    } else {
      console.log("Admin user already exists in admin.db");
      return Promise.resolve(); // Undviker att nästa then-block körs om anv finns
    }
  })
  .catch((err) => {
    console.error("Error adding admin user to admin.db:", err);
  });

// Login admin
const login = async (req, res) => {
  // Get username and password from request body
  const { username, password } = req.body;

  try {
    // Get information about user from hardcoded admin user
    const adminUser = {
      username: "admin",
      password: "password",
      role: "admin",
    };

    // Check if the username and password match the hardcoded admin user
    if (username === adminUser.username && password === adminUser.password) {
      // Set global.currentUser
      global.currentUser = {
        username: adminUser.username,
        role: adminUser.role,
      };
      // Return login success message
      return res.status(200).json({
        message: `Login successful. Logged in user: ${adminUser.username}`,
      });
    } else {
      // If username or password is incorrect, return error message
      return res.status(401).json({
        message: `Incorrect username or password.`,
      });
    }
  } catch (error) {
    // Logging error message in console
    console.error(error);
    return res.status(500).send(`Login failed.`);
  }
};

// Add product to menu
const addProduct = async (req, res) => {
  try {
    const { id, title, desc, price } = req.body;
    // Check that all necessary properties are included in the request
    if (!id || !title || !desc || !price) {
      return res.status(400).json({
        error: "All properties must be included: id, title, desc, price.",
      });
    }
    // Create new product with createdAt
    const newProduct = {
      id,
      title,
      desc,
      price,
      createdAt: new Date().toISOString(),
    };
    // Add new product to database
    const insertedProduct = await db["menu"].insert({
      type: "menu",
      data: newProduct,
    });
    return res.status(201).json(insertedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ error: "Could not add product." });
  }
};

// Delete a product from the menu
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find and remove the product from the menu
    const numRemoved = await db.menu.remove({ _id: productId });

    if (numRemoved === 0) {
      return res.status(404).json({ error: "Product was not found." });
    }

    return res.status(200).json({ message: "Product has been removed." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Could not delete product." });
  }
};

export { deleteProduct, addProduct, login };
