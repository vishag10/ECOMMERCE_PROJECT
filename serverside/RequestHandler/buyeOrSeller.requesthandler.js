import userSchema from "../models/buyerOrSeller.model.js"
import bcrypt from "bcrypt"
import jrk from "jsonwebtoken"
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "vishagchandran77@gmail.com",
        pass: "redrythljkieozqf",
    },
});
const { sign } = jrk
export async function addbuyer(req, res) {
    const { username, email, accounttype, phone, password, cpassword } = req.body
    console.log(username, email, password, cpassword);
    if (!(username && email && password && accounttype && phone))
        return res.status(404).send({ msg: "fields are empty" })
    if (password != cpassword)
        return res.status(404).send({ msg: "password not match" })

    const data = await userSchema.findOne({ email })

    if (data)
        return res.status(404).send({ msg: "email already exist" })

    const hPassword = await bcrypt.hash(password, 10)
    console.log(hPassword);

    await userSchema.create({ username, email, password: hPassword, accounttype, phone }).then(() => {
        res.status(201).send({ msg: "successfully created" })
    }).catch((err) => {
        res.status(500).send({ msg: err })
    })



}

export async function loginbuyer(req, res) {
    const { email, password } = req.body
    if (!(email && password))
        return res.status(404).send({ msg: "fields are empty" })

    const user = await userSchema.findOne({ email })
    if (user == null)
        return res.status(404).send({ msg: "email is not valid" })
    const sucess = await bcrypt.compare(password, user.password)
    console.log(sucess)
    if (!sucess)
        return res.status(404).send({ msg: "incorrept password" })

    if (user.block) {
        return res.status(404).send({ msg: "your account was been blocked by admin" })
    }

    const token = await sign({ userID: user._id }, process.env.JWT_KEY, { expiresIn: "24h" })
    res.status(200).send({ msg: "successfully loged in ", token })
}


export async function Homebuyer(req, res) {
    try {
        console.log("end point");
        console.log(req.user);
        const _id = req.user.userID;
        const user = await userSchema.findOne({ _id });
        res.status(200).send({ username: user.username, email: user.email, accounttype: user.accounttype, _id: user._id });

    } catch (error) {
        res.status(400).send({ error })
    }
}

export async function getUser(req, res) {
    try {
        const { email } = req.body;
        console.log(email);

        const user = await userSchema.findOne({ email });
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error });
    }
}


export async function passwordRequest(req, res) {
    console.log(req.body)

    try {

        const info = await transporter.sendMail({
            from: 'vishagchandran77@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "verify ✔", // Subject line
            text: "verify your email", // plain text body
            html: `<a href='http://localhost:5173/buyerresetpassword'><button style="background-color: #4CAF50; color: white; padding: 12px 20px; 
                   font-size: 16px; border: none; border-radius: 5px; 
                   cursor: pointer; transition: 0.3s; box-shadow: 2px 2px 10px rgba(0,0,0,0.2);">
        Verify
    </button></a>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).send({ msg: "check your email" });


    } catch (error) {
        res.status(500).send(error)
    }

}

export async function resetPassword(req, res) {
    try {
        console.log(req.body)
        const { email, password, cpassword } = req.body;
        if (!email && !password && !cpassword) {
            return res.status(404).send({ msg: "fields are empty" })
        }
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }
        if (password !== cpassword) {
            return res.status(404).send({ msg: "Passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userSchema.updateOne({ email }, { password: hashedPassword });
        res.status(200).send({ msg: "Password has been reset successfully" });

    } catch (error) {
        console.log(error);

    }

}
export async function updateUser(req, res) {
    try {
        const { email, phone, username } = req.body;
        await userSchema.updateOne({ email }, { $set: { email, phone, username } });
        res.status(200).send({ msg: "User updated successfully" });

    } catch (error) {
        console.log(error);

    }
}



export async function getSeller(req, res) {
    try {

        const sellers = await userSchema.find({ accounttype: "seller" });

        res.status(200).send(sellers);
    } catch (error) {
        console.error("Error fetching sellers:", error);

    }
}

export async function getBuyer(req, res) {
    try {

        const buyers = await userSchema.find({ accounttype: "buyer" });

        res.status(200).send(buyers);
    } catch (error) {
        console.error("Error fetching buyers:", error);

    }
}

export async function blockUser(req, res) {
    try {
        const { user_id } = req.body;
        const _id=user_id;
        await userSchema.findByIdAndUpdate(
           _id ,
            [{ $set: { block: { $not: "$block" } } }],
            { new: true }
        );
        res.status(200).send({ msg: "User blocked successfully" });


    } catch (error) {
        console.log(error);

    }
}
