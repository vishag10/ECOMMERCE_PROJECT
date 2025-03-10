import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    user_id:{type:String, required:true},
    address:{type:String, required:true},
    products:{type:Array},
    total_price:{type:String, required:true},
   


})
export default mongoose.model.ORDER||mongoose.model("ORDER",orderSchema)
