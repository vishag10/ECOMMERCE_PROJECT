import { Router } from "express";
import * as rh from "./RequestHandler/admin.requesthandler.js"
import * as bh from "./RequestHandler/buyeOrSeller.requesthandler.js"

import Auth from "./middleware/auth.js";

const router = Router();

// for admin
router.route("/adduser").post(rh.addUser);
router.route("/forgot").post(rh.passwordRequest);
router.route("/adminpasswordchange").put(rh.resetPassword);
router.route("/login").post(rh.loginUser);
router.route("/home").get(Auth,rh.Home);

// for buyer or seller
router.route("/addbuyerseller").post(bh.addbuyer);
router.route("/loginbuyerseller").post(bh.loginbuyer);
router.route("/homebuyerseller").get(Auth,bh.Homebuyer);
router.route("/getuser").post(bh.getUser);
router.route("/sellerforgot").post(bh.passwordRequest);
router.route("/forgotbuyerseller").post(bh.passwordRequest);
router.route("/sellerpasswordchange").put(bh.resetPassword);
router.route("/sellerupdate").put(bh.updateUser);




export default router;