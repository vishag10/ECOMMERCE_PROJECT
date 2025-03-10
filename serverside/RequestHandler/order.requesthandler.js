import orderSchema from "../models/order.model.js"


export async function AddToorder(req, res) {
    const { user_id } = req.body;

    const {orderData} = req.body;
    // console.log(user_id, orderData);
    await orderSchema.create({ user_id, address:orderData.address, products:orderData.products, total_price:orderData.total_price }).then(() => {
        res.status(201).send({ msg: "successfully added" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })
}

