const Cake = require("../models/cake.model");
const Category = require("../models/category.model");
const mongoose = require('mongoose');
 
// Add a new cake

exports.addCake = (req, res) => {
    const { cakeName, description, price, categoryName } = req.body;
    const imagePath = req.file ? req.file.path : null; // Store image path
  
    if (!imagePath) {
       res.status(400).json({ message: "Image upload failed!" });
       return
    } 
    const newCake = new Cake({
        cakeName,
        description,
        price,
        image: imagePath,
        categoryName: categoryName
    });
    newCake.save()
        .then((cake) => res.status(201).json({ message: "Cake added successfully!", cake }))
        .catch((error) => res.status(500).json({ message: "Error adding cake", error }));
}
 
// Get all cakes
exports.getCakes = (req, res) => {
  Cake.find()
    .then((cakes) =>{
        console.log(cakes); 
        res.status(200).json(cakes)
    })
    .catch((error) => res.status(500).json({ message: "Error fetching cakes", error }));
};

exports.searchCakes=(req, res) => {
  const { name } = req.query; // Get search query from frontend
 
    if (!name) {
        return res.status(400).json({ message: "Search query is required" });
    }
 
    // Perform case-insensitive search
    Cake.find({ cakeName: { $regex: name, $options: 'i' } })
        .then(cakes => {
            if (cakes.length === 0) {
                return res.status(404).json({ message: "No cakes found" });
            }
            res.status(200).json(cakes);
        })
        .catch(error => {
            res.status(500).json({ message: "Server error", error });
        });
}

exports.viewCake=(req,res)=>{
  const { id } = req.params;
 
    Cake.findOne({ id })
        .then(cake => {
            if (!cake) {
                return res.status(404).json({ message: "Cake not found" });
            }
            res.status(200).json({
                id:cake._id,
                cakeName: cake.cakeName,
                description: cake.description,
                price: cake.price
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Server error", error });
        });
}

 
exports.getCakesByCategory = (req, res) => {
    const categoryId = req.params.categoryId;
 
    Cake.find({ category: categoryId })
        .then(cakes => {
            if (cakes.length === 0) {
                return res.status(404).json({ message: "No cakes found in this category" });
            }
            res.status(200).json(cakes);
        })
        .catch(error => res.status(500).json({ message: "Error fetching cakes", error }));
};
 