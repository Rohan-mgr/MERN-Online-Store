const express = require("express");
const router = express.Router();
const shopController = require("../controller/shop");
const isAuth = require("../middleware/isAuth");

router.get("/product", shopController.getProducts);
router.get("/product/:productId", shopController.getSingleProduct);
router.get("/cart", isAuth, shopController.getCartProducts);
router.get("/checkout", isAuth, shopController.getCheckout);
router.get("/checkout/success/:id", shopController.getCheckoutSuccess);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.post("/cart", isAuth, shopController.addToCart);
router.post("/checkout", isAuth, shopController.postCheckout);
router.post("/", shopController.postUserMessage);

router.delete("/cart/:cartItemId", isAuth, shopController.deleteCartItem);

module.exports = router;
