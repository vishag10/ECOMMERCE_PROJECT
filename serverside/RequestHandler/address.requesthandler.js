import addressSchema from "../models/address.model.js"

export async function addAddress(req, res) {
  const { line, district, pincode, phone, address_id } = req.body;
  console.log(line, district, pincode, phone, address_id);

  if (!(line && district && pincode && phone)) {
    return res.status(400).send({ msg: "All fields are required" });
  }

  try {
    await addressSchema.create({ address_id, line, district, pincode, phone });
    res.status(201).send({ msg: "Address successfully added" });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
}

export async function getAddresses(req, res) {
    try {
        const { _id } = req.params;
        console.log(_id);
        const address_id=_id;
        const address = await addressSchema.find({ address_id });

        if (!address || address.length === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json(address);
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteAddress(req, res) {
    const {_id}=req.params;
    await addressSchema.deleteOne({_id})
    .then(()=>{
        res.status(200).send({msg:"address deleted successfully"})
    }).catch((err)=>{
        res.status(500).send(err)
    })

    
}