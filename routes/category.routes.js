const express = require('express');
const router = express.Router();
const { getAllCategories, addCategory } = require('../controller/category.controller');
 
router.post('/addcategory', addCategory)
router.get('/', getAllCategories); // Fetch all categories
 
module.exports = router;