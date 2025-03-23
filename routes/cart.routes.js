const express = require("express");
const { addToCart, getCartWithTotal, removeFromCart } = require("../controller/cart.controller");
 
const router = express.Router();
 
// Add a cake to cart
router.post("/add", addToCart);
 
// Get cart items for a user
router.get("/:userId", getCartWithTotal);
 
// Remove an item from cart
router.delete("/remove/:cartItemId", removeFromCart);
 
module.exports = router;