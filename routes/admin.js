import { Router } from "express";
import {
  deleteProduct,
  addProduct,
  login,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = Router();

// Log in admin
router.post("/login", login);

/* // Log out admin
router.post("/logout", logout); */

// Add a product to the menu
router.post("/addProduct", adminAuth, addProduct);

// Delete a product from the menu
router.delete("/deleteProduct/:productId", adminAuth, deleteProduct);

export default router;
