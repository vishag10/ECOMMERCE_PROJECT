import productSchema from "../models/product.model.js";
import mongoose from "mongoose";

export async function addProduct(req, res) {
  const {
    product_name,
    category,
    price,
    photos,
    quantity,
    cname,
    clocation,
    product_id,
  } = req.body;

  if (
    !(
      product_name &&
      category &&
      price &&
      photos &&
      quantity &&
      cname &&
      clocation
    )
  )
    return res.status(404).send({ msg: "fields are empty" });

  await productSchema
    .create({
      product_id,
      product_name,
      category,
      price,
      photos,
      quantity,
      cname,
      clocation,
    })
    .then(() => {
      res.status(201).send({ msg: "successfully added" });
    })
    .catch((err) => {
      res.status(500).send({ msg: err });
    });
}

export async function getProducts(req, res) {
  try {
    const { user_id } = req.body; // Get user_id from request body

    if (!user_id) {
      return res.status(400).send({ msg: "user_id is required" });
    }

    // Fetch products where product_id is NOT equal to user_id
    const products = await productSchema.find({
      product_id: { $ne: user_id },
    });

    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ msg: "Server error" });
  }
}

export async function getProduct(req, res) {
  try {
    const { _id } = req.params;
    const products = await productSchema.findOne({ _id });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
}

export async function sellerProduct(req, res) {
  try {
    const { _id } = req.params;
    const product_id = _id;
    const products = await productSchema.find({ product_id });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProduct(req, res) {
  const { _id } = req.params;
  await productSchema
    .deleteOne({ _id })
    .then(() => {
      res.status(200).send({ msg: "item deleted successfully" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export async function updateProduct(req, res) {
  const { _id } = req.params;
  const {
    product_name,
    category,
    price,
    photos,
    quantity,
    cname,
    clocation,
    product_id,
    discount,
  } = req.body;

  if (
    !(
      product_name &&
      category &&
      price &&
      photos &&
      quantity &&
      cname &&
      clocation
    )
  )
    return res.status(404).send({ msg: "fields are empty" });

  await productSchema.updateOne(
    { _id },
    {
      $set: {
        product_name,
        category,
        price,
        photos,
        quantity,
        cname,
        clocation,
        discount,
      },
    }
  );
  res.status(200).send({ msg: "item updated successfully" });
}

export async function getsingleProduct(req, res) {
  try {
    const { _id } = req.body;
    const products = await productSchema.find({ _id });
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProductAdmin(req, res) {
  try {
    const products = await productSchema.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
}

export async function updateProductQuantity(req, res) {
    try {
        const { orderdProducts } = req.body; // Expect an array of products with _id and quantity

        console.log("orderedproduct", orderdProducts);

        if (!orderdProducts || !Array.isArray(orderdProducts)) {
            return res.status(400).send({ msg: "Invalid orderdProducts data" });
        }

        for (const product of orderdProducts) {
            const { product_id, quantity } = product;

            // Find the product by _id
            const existingProduct = await productSchema.findById(product_id);

            if (!existingProduct) {
                console.error(`❌ Product not found: ${product_id}`);
                continue; // Skip updating this product
            }

            // Ensure stock is not negative
            const newQuantity = existingProduct.quantity - quantity;
            if (newQuantity < 0) {
                console.warn(`⚠ Not enough stock for product ${product_id}`);
                continue;
            }

            console.log(`Updating product ${product_id} -> New Quantity:`, newQuantity);

            // ✅ Corrected: Update using _id
            await productSchema.updateOne({ _id: product_id }, { $set: { quantity: newQuantity } });
        }

        res.status(200).send({ msg: "All ordered products updated successfully" });
    } catch (error) {
        console.error("❌ Error updating quantity:", error);
        res.status(500).send({ msg: "Error updating quantity", error });
    }
}



export async function getProductData(req, res) {
    try {
      const { _id } = req.query; // Change from req.body to req.query
  
      if (!_id) {
        return res.status(400).json({ msg: "Product ID is required" });
      }
  
      const product = await productSchema.findOne({ _id });
  
      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }
  
      res.status(200).json(product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({ msg: "Error fetching product", error });
    }
  }