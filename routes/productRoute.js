const express = require("express");
const {getAllProducts,createProduct, updateProducts, deleteProducts, getProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/productController.js");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth.js");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateProducts)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProducts)
.get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews)
.delete(isAuthenticatedUser,deleteReview);
//router.route("/product/:id").put(deleteProducts);


module.exports = router;