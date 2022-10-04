const Product = require("../model/product");
require("dotenv").config();
const User = require("../model/user");
const Order = require("../model/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getProducts = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next();
  }
};

exports.getSingleProduct = async (req, res, next) => {
  let productId = req.params.productId;
  try {
    let fetchedProduct = await Product.findById(productId);
    res.status(200).json({
      message: "Product fetched successfully",
      product: fetchedProduct,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next();
  }
};

exports.addToCart = async (req, res, next) => {
  const productId = req.body.prodId;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error("product not found!");
      err.statusCode = 404;
      throw err;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User does not Exists!");
      err.statusCode = 404;
      throw err;
    }
    await user.addToCart(productId);
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    if (!error.status) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.getCartProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 404;
      throw error;
    }
    const { cart } = await user.populate("cart.items.productId");
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  const cartProductId = req.params.cartItemId;
  console.log(cartProductId);
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 404;
      throw error;
    }
    await user.deleteCartItem(cartProductId);
    const { cart } = await user.populate("cart.items.productId");
    res.status(200).json({ cartItems: cart.items });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCheckoutSuccess = async (req, res, next) => {
  console.log(req.params.id, "checkout");
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 404;
      throw error;
    }
    const { cart } = await user.populate("cart.items.productId");
    const orderedProducts = cart.items.map((i) => {
      return {
        product: { ...i.productId._doc },
        quantity: i.quantity,
      };
    });
    const order = new Order({
      user: {
        email: user.email,
        userId: user._id,
      },
      products: orderedProducts,
    });
    await order.save();
    await user.clearCartItems();
    res.redirect("http://localhost:3000/orders");
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCheckout = async (req, res, next) => {
  let total = 0;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User does not Exists!");
      error.statusCode = 404;
      throw error;
    }
    const { cart } = await user.populate("cart.items.productId");
    cart.items.map((i) => {
      return (total += i.quantity * i.productId.price);
    });
    res.status(200).json({ cartItems: cart.items, Total: total });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCheckout = async (req, res, next) => {
  const items = req.body.prods;
  console.log(items, req.userId);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((p) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: p.productId.price * 100,
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
          },
          quantity: p.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${req.userId}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });
    res.status(200).json({
      message: "checkout successfull",
      url: session.url,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.userId });
    console.log(orders);
    res
      .status(200)
      .json({ message: "order fetched successfully", orderedItems: orders });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
