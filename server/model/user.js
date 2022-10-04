const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (prodId) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return prodId.toString() === cp.productId.toString();
  });
  const updatedCartItem = [...this.cart.items];
  if (cartProductIndex > -1) {
    updatedCartItem[cartProductIndex].quantity += 1;
  } else {
    updatedCartItem.push({
      productId: prodId,
      quantity: 1,
    });
  }
  const updatedCart = {
    items: updatedCartItem,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (pId) {
  const cartItems = [...this.cart.items];
  const updatedCartItems = cartItems.filter((cp) => {
    return cp.productId._id.toString() !== pId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCartItems = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
