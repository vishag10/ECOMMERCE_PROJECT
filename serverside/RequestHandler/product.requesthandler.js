import productSchema from "../models/product.model.js"

export async function addProduct(req,res){
    const { product_name, category, price, photos, quantity, cname,clocation,product_id} = req.body
    console.log(product_name, category, price, photos, quantity, cname,clocation);
    
    if (!(product_name && category && price && photos && quantity&&cname&&clocation))
        return res.status(404).send({ msg: "fields are empty" })

    await productSchema.create({product_id,product_name, category, price, photos, quantity, cname,clocation}).then(() => {
        res.status(201).send({ msg: "successfully added" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })
}

export async function getProducts(req,res){
    try {
        const products = await productSchema.find();
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        
    }
}
export async function getProduct(req,res){
    try {
        const {_id}=req.params;
        const products = await productSchema.findOne({_id});
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        
    }
}

export async function sellerProduct(req,res){
    try {
        const {_id}=req.params;
        const product_id=_id
        const products = await productSchema.find({product_id});
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        
    }
    
}