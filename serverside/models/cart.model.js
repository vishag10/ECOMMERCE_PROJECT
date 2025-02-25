import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({
    user_id:{type:String, required:true},
    product_id:{type:String, required:true}

})
export default mongoose.model.CART||mongoose.model("CART",cartSchema)
