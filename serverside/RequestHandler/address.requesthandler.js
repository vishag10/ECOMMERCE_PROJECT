import addressSchema from "../models/address.model.js"

export async function addAddress(req,res){
    const { line, district, pincode,phone,_id} = req.body
    console.log(line, district, pincode,phone,_id);
    
    if (!(line && district && pincode && phone ))
        return res.status(404).send({ msg: "fields are empty" })

    await addressSchema.create({_id,line, district, pincode,phone}).then(() => {
        res.status(201).send({ msg: "successfully added" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })
}