import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    line:{type:String, required:true},
    address_id:{type:String, required:true},
    district:{type:String, required:true},
    pincode:{type:Number, required:true},
    phone:{type:Number, required:true},
    

})
export default mongoose.model.ADDRESS||mongoose.model("ADDRESS",userSchema)