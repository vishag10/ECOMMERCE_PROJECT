import { Router } from "express";
import * as rh from "./RequestHandler/admin.requesthandler.js"
import * as bh from "./RequestHandler/buyeOrSeller.requesthandler.js"
import * as ph from "./RequestHandler/product.requesthandler.js"
import * as ah from "./RequestHandler/address.requesthandler.js"
import * as ch from "./RequestHandler/kart.requesthandler.js"

import Auth from "./middleware/auth.js";

const router = Router();

// for admin
router.route("/adduser").post(rh.addUser);
router.route("/forgot").post(rh.passwordRequest);
router.route("/adminpasswordchange").put(rh.resetPassword);
router.route("/login").post(rh.loginUser);
router.route("/home").get(Auth,rh.Home);
router.route("/allproductsadmin").get(ph.getAllProductAdmin)
router.route("/blockuser").put(bh.blockUser)


// for buyer or seller
router.route("/addbuyerseller").post(bh.addbuyer);
router.route("/loginbuyerseller").post(bh.loginbuyer);
router.route("/homebuyerseller").get(Auth,bh.Homebuyer);
router.route("/getuser").post(bh.getUser);
router.route("/sellerforgot").post(bh.passwordRequest);
router.route("/forgotbuyerseller").post(bh.passwordRequest);
router.route("/sellerpasswordchange").put(bh.resetPassword);
router.route("/sellerupdate").put(bh.updateUser);
router.route("/getseller").get(bh.getSeller);
router.route("/getbuyer").get(bh.getBuyer);

//product
router.route("/addproduct").post(ph.addProduct);
router.route("/getproduct").post(ph.getProducts);
router.route("/getproducts").post(ph.getsingleProduct);
router.route("/oneproduct/:_id").get(ph.getProduct);
router.route("/sellerproduct/:_id").get(ph.sellerProduct);
router.route("/deleteproduct/:_id").delete(ph.deleteProduct);
router.route("/updateproduct/:_id").put(ph.updateProduct);

//address
router.route("/addaddress").post(ah.addAddress);
router.route("/getaddress/:_id").get(ah.getAddresses);
router.route("/deleteaddress/:_id").delete(ah.deleteAddress);

//cart
router.route("/addcart").post(ch.addToCart);
router.route("/getcartcheck/:user_id").get(ch.checkCartitems);
router.route("/getcart").get(ch.getCart);
router.route("/deletecart/:id").delete(ch.removeCartItem);


export default router;