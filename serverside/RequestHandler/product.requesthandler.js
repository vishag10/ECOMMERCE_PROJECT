import productSchema from "../models/product.model.js"

export async function addProduct(req,res){
    const { product_name, category, price, photos, quantity, cname,clocation,_id} = req.body
    console.log(product_name, category, price, photos, quantity, cname,clocation);
    
    if (!(product_name && category && price && photos && quantity&&cname&&clocation))
        return res.status(404).send({ msg: "fields are empty" })

    await productSchema.create({_id,product_name, category, price, photos, quantity, cname,clocation}).then(() => {
        res.status(201).send({ msg: "successfully added" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })
}