import orderSchema from "../models/order.model.js"
import cartSchema from "../models/cart.model.js"
import addressSchema from "../models/address.model.js"



export async function AddToorder(req, res) {
    try {
        const { user_id, orderData } = req.body;

        if(!orderData.address){
           return res.status(201).send({ msg: "Add Address" });
        }


        await orderSchema.create({
            user_id,
            address: orderData.address,
            products: orderData.products,
            total_price: orderData.total_price
        });

        const deleteResult = await cartSchema.deleteMany({ user_id: user_id });

        // console.log(${deleteResult.deletedCount} cart items deleted for user ${user_id});

        res.status(201).send({ msg: "Successfully added" });
    } catch (err) {
        console.error("Error in AddToorder:", err);
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
}

export async function GetAddress(req, res) {
    try {
      const { address_id } = req.body;
  
      if (!address_id) {
        return res.status(400).json({ msg: "Address ID is required" });
      }
  
      // ✅ Fetch address from database
      const getaddress = await addressSchema.findOne({ address_id });
  
      if (!getaddress) {
        return res.status(404).json({ msg: "Address not found" });
      }
  
      console.log("Fetched Address:", getaddress);
      res.status(200).json(getaddress);
      
    } catch (error) {
      console.error("Error in GetAddress:", error);
      res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
  }