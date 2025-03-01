import wishlistSchema from "../models/wishlist.model.js";


export async function addProductToWishlist(req,res){
    const {product,user_id} = req.body;
    console.log(product, user_id);
    
    await wishlistSchema.create({product,user_id}).then(() => {
        res.status(201).send({ msg: "successfully added" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })
}