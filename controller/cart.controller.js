const ShoppingCart = require("../models/shoppingcart.model");
const CartItem = require("../models/cartitem.model");
 

exports.addToCart = (req, res) => {
  const { userId, cakeId, quantity } = req.body;
 
  ShoppingCart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        // If no cart exists, create one
        return ShoppingCart.create({ userId }).then((newCart) => {
          return { cart: newCart };
        });
      }
      return { cart };
    })
    .then(({ cart }) => {
      // Add the item to CartItem Collection
      return CartItem.create({
        shoppingcartId: cart._id,
        cakeId,
        quantity,
      });
    })
    .then((cartItem) => {
      res.status(201).json({ message: "Cake added to cart", cartItem });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error adding to cart", error });
    });
};
 
 
exports.getCartWithTotal = (req, res) => {
  const { userId } = req.params;
 
  // Find Shopping Cart for the User
  ShoppingCart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
 
      // Fetch Cart Items and Populate Cake Details
      return CartItem.find({ shoppingcartId: cart._id }).populate("cakeId");
    })
    .then((cartItems) => {
      if (!cartItems.length) {
        return res.status(200).json({ cartItems: [], totalQuantity: 0, totalPrice: 0 });
      }
 
      // Calculate Total Quantity & Price
      let totalQuantity = 0;
      let totalPrice = 0;
 
      cartItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalPrice += item.quantity * item.cakeId.price;
      });
 
      // Send Response
      res.status(200).json({ cartItems, totalQuantity, totalPrice });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error fetching cart", error });
    });
};
 
exports.removeFromCart = (req, res) => {
  const { cartItemId } = req.params;
 
  CartItem.findByIdAndDelete(cartItemId)
    .then(() => {
      res.status(200).json({ message: "Item removed from cart" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error removing item", error });
    });
};

exports.updateCart = (req, res) => {
    const { shoppingcartId, cakeId, quantity } = req.body;
 
    if (!shoppingcartId || !cakeId || quantity ===undefined) {
        return res.status(400).json({ message: 'Invalid input data' });
    }
    
    ShoppingCart.findById(shoppingcartId)
        .then(cart => {
          console.log(cart)
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            return CartItem.findOne({shoppingcartId, cakeId})
          })
          .then(cartItem=>{
            if(cartItem){
              cartItem.quantity= quantity;
              return cartItem.save();
            }else{
              const newCartItem = new CartItem({shoppingcartId,cakeId, quantity})
              return newCartItem.save()
            }
            
          })
      .then(updatedCartItem => {
          if (updatedCartItem) {
              res.status(200).json({ message: 'Cart updated successfully', cartItem: updatedCartItem });
          }
      })
      .catch(error => {
          console.error('Error updating cart:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
      });
};
 
