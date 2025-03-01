import mongoose from "mongoose";

const wishlistSchema=new mongoose.Schema({
    user_id:{type:String, required:true},
    products:{type:Array}

})
export default mongoose.model.wishlist||mongoose.model("wishlist",wishlistSchema)
