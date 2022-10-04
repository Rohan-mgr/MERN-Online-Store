const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");
const isAuth = require("../middleware/isAuth");

router.post("/product", isAuth, adminController.createPost);
router.get("/products", adminController.getAdminProducts);
router.put("/product/:productId", adminController.updateProduct);
router.delete("/products/:productId", adminController.deleteProduct);

module.exports = router;
