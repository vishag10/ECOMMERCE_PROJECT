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

export async function getProducts(req, res) {
    try {
        const { user_id } = req.body;  // Get user_id from request body
        console.log("Received user_id:", user_id);

        if (!user_id) {
            return res.status(400).send({ msg: "user_id is required" });
        }

        // Fetch products where product_id is NOT equal to user_id
        const products = await productSchema.find({
            product_id: { $ne: user_id }
        });

        console.log("Filtered Products:", products);
        res.status(200).send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ msg: "Server error" });
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

export async function deleteProduct(req, res) {
    const {_id}=req.params;
    await productSchema.deleteOne({_id})
    .then(()=>{
        res.status(200).send({msg:"item deleted successfully"})
    }).catch((err)=>{
        res.status(500).send(err)
    })

    
}

export async function updateProduct(req,res){
    const {_id}=req.params;
    const { product_name, category, price, photos, quantity, cname,clocation,product_id,discount} = req.body

    if (!(product_name && category && price && photos && quantity&&cname&&clocation))
        return res.status(404).send({ msg: "fields are empty" })
    
    await productSchema.updateOne({_id},{$set:{product_name, category, price, photos, quantity, cname,clocation,discount}})
    res.status(200).send({msg:"item updated successfully"})
}


export async function getsingleProduct(req,res){
    try {
        const {_id}=req.body;
        const products = await productSchema.find({_id});
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        
    }
}

export async function getAllProductAdmin(req,res){
    try {
        const products = await productSchema.find();
        res.status(200).send(products)
    } catch (error) {
        console.log(error);
        
    }
}