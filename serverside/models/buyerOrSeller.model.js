import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String, required:true},
    accounttype:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true},
    password:{type:String, required:true},
    block:{type:Boolean, default:false}

})
export default mongoose.model.USER||mongoose.model("USER",userSchema)
