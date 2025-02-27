import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    product_name:{type:String, required:true},
    product_id:{type:String, required:true},
    category:{type:String, required:true},
    price:{type:Number, required:true},
    photos:{type:Array, required:true},
    quantity:{type:Number, required:true},
    cname:{type:String, required:true},
    clocation:{type:String, required:true},
    discount:{type:Number},
    
})
export default mongoose.model.PRODUCTS||mongoose.model("PRODUCTS",userSchema)
