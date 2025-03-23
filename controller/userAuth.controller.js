const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 
// User Registration
exports.register = (req, res) => {
    const { name, email, password, confirmPassword, phone } = req.body;
    
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    // Check if the user already exists
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
 
            // Hash password
            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            // Create new user
            const newUser = new User({ name, email, password: hashedPassword, phone });
            return newUser.save();
        })
        .then(() => {
            res.status(201).json({ message: "User registered successfully" });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};
 
// User Login
exports.login = (req, res) => {
    const { email, password } = req.body;
 
    // Check if user exists
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return Promise.reject({ message: "Invalid email or password" });
            }
 
            // Compare password
            return bcrypt.compare(password, user.password).then(isMatch => {
                if (!isMatch) {
                    return Promise.reject({ message: "Invalid email or password" });
                }
 
                // Generate JWT Token
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
 
                res.json({ token, userId: user._id, message: "Login successful" });
            });
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
        });
};
 //veiw profile
exports.getUserProfile = (req, res) => {
    const userId = req.params.id; // Get user ID from request params
     
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(200).json(user);
            })
            .catch(error => res.status(500).json({ message: "Server error", error }));
    };
 
// Update User Profile
exports.update = (req, res) => {
    const { userId, name, password } = req.body;
 
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.name = name || user.name;
            if (password) {
                return bcrypt.hash(password, 10).then(hashedPassword => {
                    user.password = hashedPassword;
                    return user.save();
                });
            }
            return user.save();
        })
        .then(() => {
            res.status(200).json({ message: "Profile updated successfully" });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};
 
// Delete User Profile
exports.deleteUser = (req, res) => {
    const { userId } = req.body;
 
    User.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).json({ message: "Profile deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

exports.logout=(req,res)=>{
    res.status(200).json({message:"Logout Successful"})
}