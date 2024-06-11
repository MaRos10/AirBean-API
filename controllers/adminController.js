import db from "../db/database.js";
import menu from "../services/menu.js";

// Function to move data from menu.js to menu.db
async function moveData() {
  try {
    // Fetch all items from database
    const existingMenuItems = await db.menu.find({});

    // Create a set of existing IDs for quick lookup
    const existingIds = new Set(existingMenuItems.map((item) => item.id));

    // Loop through each item in menu.js
    for (const menuItem of menu) {
      // Check if the item already exists in the database
      if (!existingIds.has(menuItem.id)) {
        // Insert the item into menu.db if it doesn´t already exist
        await db.menu.insert(menuItem);
      }
    }
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
      // If admin-user doesn´t exist, add admin to admin.db
      return db.admin.insert(adminUser).then(() => {
        console.log("Admin user added successfully to admin.db");
      });
    } else {
      // Returns a resolved promise
      return Promise.resolve();
    }
  })
  .catch((err) => {
    console.error("Error adding admin user to admin.db:", err);
  });

/* ----------   Get the menu ---------- */

const getMenu = async (req, res) => {
  try {
    // Fetch all items from the menu collection
    const menuItems = await db.menu.find({});
    return res.status(200).json(menuItems);
  } catch (error) {
    return res.status(500).json({ error: "Could not fetch menu." });
  }
};

/* ----------   Log in admin ---------- */

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
    // Error message if login fails
    return res.status(500).send(`Login failed.`);
  }
};

/* ----------   Add product to menu ---------- */

const addProduct = async (req, res) => {
  try {
    const { id, title, desc, price, ...rest } = req.body;

    // Check that all necessary properties are included in the request
    if (!id || !title || !desc || !price) {
      return res.status(400).json({
        error: "All properties must be included: id, title, desc, price.",
      });
    }

    // Check for any additional properties
    const allowedProperties = ["id", "title", "desc", "price"];
    const receivedProperties = Object.keys(req.body);
    const invalidProperties = receivedProperties.filter(
      (prop) => !allowedProperties.includes(prop)
    );

    if (invalidProperties.length > 0) {
      return res.status(400).json({
        error: `Invalid properties: ${invalidProperties.join(
          ", "
        )}. Only id, title, desc, and price are allowed.`,
      });
    }

    // Check if the id already exists in the database
    const existingProduct = await db.menu.findOne({ _id: id });
    if (existingProduct) {
      return res.status(400).json({
        error: "A product with this id already exists.",
      });
    }

    // Create new product with createdAt and the provided id as _id
    const newProduct = {
      _id: id,
      title,
      desc,
      price,
      createdAt: new Date().toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
      }),
    };

    // Add new product to database
    const insertedProduct = await db.menu.insert(newProduct);
    return res.status(201).json(insertedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Could not add product." });
  }
};

/* ----------   Delete a product from the menu ---------- */

const deleteProduct = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);

    // Find and remove the product from the menu
    const numRemoved = await db.menu.remove({ _id: itemId });

    if (numRemoved === 0) {
      return res.status(404).json({ error: "Product was not found." });
    }

    return res.status(200).json({ message: "Product has been removed." });
  } catch (error) {
    return res.status(500).json({ error: "Could not delete product." });
  }
};

/* ----------   Change product in menu ---------- */

const changeProduct = async (req, res) => {
  try {
    // Convert itemId to integer
    const itemId = parseInt(req.params.itemId);

    const { title, desc, price } = req.body;

    // Checks if one of the fields are filled in
    if (title === undefined && desc === undefined && price === undefined) {
      return res.status(400).json({
        message:
          "At least one of title, description or price must be provided.",
      });
    }

    // Sends errormessage is user tries to edit product ID
    if (req.body._id && req.body._id !== itemId) {
      return res.status(400).json({
        message: "Changing the product ID is not allowed.",
      });
    }

    // Find the product in the menu based on its _id
    const product = await db.menu.findOne({ _id: itemId });

    // If the product does not exist, send an error message
    if (!product) {
      return res.status(404).json({ error: "Product was not found." });
    }

    // Update the product's information if there are any changes
    if (title) product.title = title;
    if (desc) product.desc = desc;
    if (price) product.price = price;

    // Update "modifiedAt" to the current timestamp
    product.modifiedAt = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });

    // Save the updated product to the database
    await db.menu.update({ _id: itemId }, product);

    // If success - send a response
    return res.status(200).json({
      success: true,
      message: "Item updated in menu",
      item: product,
    });
  } catch (error) {
    // Error message
    console.error("Error changing product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Could not change product." });
  }
};

export { login, getMenu, addProduct, changeProduct, deleteProduct };
