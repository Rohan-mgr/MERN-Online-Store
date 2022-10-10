const Product = require("../model/product");
require("dotenv").config();
const User = require("../model/user");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const Order = require("../model/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const mailer = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.postUserMessage = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  console.log(name, email, typeof email, subject, message);

  mailer.sendMail({
    to: "rohan.magar.415@gmail.com",
    from: "rohan.magar.415@gmail.com",
    replyTo: email,
    fromname: name,
    subject: subject,
    html: `<div style="text-align: center;">
          <h2>Message From ${name}</h2>
          <p>Sender Email: ${email}</p>
          <p>${message}</p>
        </div>`,
  });
  res.status(200).json({ message: "Message sent successfully." });
};

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
    if (!cart) {
      const error = new Error("No Items added to cart");
      error.statusCode = 404;
      throw error;
    }
    console.log(cart);
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
    if (!req.userId) {
      const error = new Error("User does not Exists!");
      throw error;
    }
    const orders = await Order.find({ "user.userId": req.userId });
    if (!orders) {
      const error = new Error("No products ordered");
      throw error;
    }
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

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new Error("No order found!"));
  }
  if (order.user.userId.toString() !== req.userId.toString()) {
    return next(new Error("Unauthorized User"));
  }
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join("data", "invoice", invoiceName);

  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    'inline; filename="' + invoiceName + '"'
  );
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  pdfDoc.fontSize(26).text("Order Invoice", { underline: true });
  pdfDoc.text("---------------------------------");
  let totalCost = 0;
  order.products.forEach((prod) => {
    totalCost += prod.quantity * prod.product.price;
    pdfDoc
      .fontSize(16)
      .text(
        `${prod.product.title} = ${prod.quantity}(Quantity) * ${prod.product.price}(Unit Price)`
      );
  });
  pdfDoc.text("-----------------------------------------------------");
  pdfDoc.fontSize(28).text(`Total Amount = $${totalCost}`);
  pdfDoc.end();
};
