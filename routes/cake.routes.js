const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { addCake, getCakes, searchCakes, viewCake, getCakesByCategory } = require("../controller/cake.controller");
 
// Route to add a new cake (POST)
router.post("/add", upload.single("image"), addCake);
 
// Route to get all cakes (GET)
router.get("/all", getCakes);
router.get("/search", searchCakes)
router.get("/:cakeId", viewCake)
router.get('/category/:categoryname',getCakesByCategory)
module.exports = router;