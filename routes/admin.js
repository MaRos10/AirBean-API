import { Router } from "express";
import {
  login,
  getMenu,
  addProduct,
  changeProduct,
  deleteProduct,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { createCampaign } from "../controllers/campaignController.js";

const router = Router();

// Log in admin
router.post("/login", login);

// Get menu
router.get("/menu", getMenu);

// Add a product to the menu
router.post("/addProduct", adminAuth, addProduct);

// Change a product in the menu
router.put("/changeProduct/:itemId", adminAuth, changeProduct);

// Delete a product from the menu
router.delete("/deleteProduct/:itemId", adminAuth, deleteProduct);

// Handle campaign
router.post("/campaign", adminAuth, createCampaign);

export default router;
