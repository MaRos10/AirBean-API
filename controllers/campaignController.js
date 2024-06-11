import db from "../db/database.js";

/* ----------   Controller to add campaign ---------- */

// Checks if the products exists in menu database
const validateProducts = async (productIds) => {
  try {
    const products = await db.menu.find({ _id: { $in: productIds } });
    return products.length === productIds.length ? products : null;
  } catch (error) {
    throw error;
  }
};

// Create campaign
const createCampaign = async (req, res) => {
  try {
    const { products } = req.body;

    // Check if all necessary properties are included in the request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error:
          "Products must be included and must be an array with at least one product.",
      });
    }

    // Validate the products
    const validProducts = await validateProducts(products);
    if (!validProducts) {
      return res
        .status(400)
        .json({ message: "One or more products are invalid." });
    }

    // Calculate campaignprice with a 10% discount on the total price of the products
    const totalOriginalPrice = validProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
    const calculatedCampaignPrice = (totalOriginalPrice * 0.9).toFixed(2);

    // Create and save the campaign
    const campaign = {
      products,
      campaignPrice: calculatedCampaignPrice,
      createdAt: new Date().toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
      }),
    };

    // Insert new campaign in campaign database
    const newCampaign = await db.campaigns.insert(campaign);
    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    return res.status(500).json({ error: "Could not add campaign." });
  }
};

export { createCampaign };
