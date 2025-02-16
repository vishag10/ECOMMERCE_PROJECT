import { Router } from "express";
import * as rh from "./RequestHandler/admin.requesthandler.js"
import * as bh from "./RequestHandler/buyeOrSeller.requesthandler.js"

import Auth from "./middleware/auth.js";

const router = Router();
router.route("/adduser").post(rh.addUser);
router.route("/addbuyerseller").post(bh.addbuyer);
router.route("/login").post(rh.loginUser);
router.route("/loginbuyerseller").post(bh.loginbuyer);
router.route("/home").get(Auth,rh.Home);
router.route("/homebuyerseller").get(Auth,bh.Homebuyer);
router.route("/forgot").post(rh.passwordRequest);
router.route("/forgotbuyerseller").post(bh.passwordRequest);


export default router;