import cartSchema from "../models/cart.model.js"


export async function addToCart(req, res) {
    const { product_id,user_id } = req.body;
    console.log(product_id, user_id);
     await cartSchema.create({product_id,user_id}).then(() => {
            res.status(201).send({ msg: "successfully added" })
        }).catch((err) => {
            res.status(500).send({ msg: err })
        })
}

export async function getCart(req,res){
    try {
        const {user_id}= req.body
        const carts = await cartSchema.find({user_id});
        res.status(200).send(carts)
    } catch (error) {
        console.log(error);
        
    }
}


export async function checkCartitems(req,res){
    try {
        const cartItems = await cartSchema.find({ user_id: req.params.user_id });
        res.json(cartItems);
      } catch (error) {
        res.status(500).json({ message: "Error fetching cart details" });
      }
}

export async function removeCartItem(req,res){
    try {
        const { id } = req.params;
        await cartSchema.findOneAndDelete({product_id:id});
        res.status(201).send({ msg: "remove succesfullly" })
      } catch (error) {
        res.status(500).send({ message: "Error deleting cart item" });
      }
}
