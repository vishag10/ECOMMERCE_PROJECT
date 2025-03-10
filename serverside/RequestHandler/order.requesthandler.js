import orderSchema from "../models/order.model.js"
import cartSchema from "../models/cart.model.js"



export async function AddToorder(req, res) {
    try {
        const { user_id, orderData } = req.body;

        await orderSchema.create({
            user_id,
            address: orderData.address,
            products: orderData.products,
            total_price: orderData.total_price
        });

        const deleteResult = await cartSchema.deleteMany({ user_id: user_id });

        console.log(`${deleteResult.deletedCount} cart items deleted for user ${user_id}`);

        res.status(201).send({ msg: "Successfully added" });
    } catch (err) {
        console.error("Error in AddToorder:", err);
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
}


