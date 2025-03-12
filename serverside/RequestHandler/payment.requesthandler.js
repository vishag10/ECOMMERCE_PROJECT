import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

// Initialize Razorpay with correct API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Ensure this is defined in .env
  key_secret: process.env.RAZORPAY_SECRET_KEY, // Ensure this is defined in .env
});

// ✅ Create Razorpay Order (Fix: Proper Error Handling)
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log("Received Order Request:", req.body);
    
    const { amount, currency } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount, // Amount in paise (multiply by 100 for INR)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("option",options)

    const order = await razorpay.orders.create(options);
    console.log("Razorpay Order Created:", order);
    
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order", details: error.message });
  }
};

// ✅ Verify Razorpay Payment
export const verifyRazorpayPayment = async (req, res) => {
    try {
      console.log("🔹 Incoming Razorpay Payment Verification Request:", req.body);
  
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      // ✅ Step 1: Check if all required fields are present
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("❌ Missing payment details:", req.body);
        return res.status(400).json({ success: false, error: "Missing payment details" });
      }
  
      const secret = process.env.RAZORPAY_SECRET_KEY;
  
      // ✅ Step 2: Ensure the Secret Key is loaded from .env
      if (!secret) {
        console.error("❌ Razorpay Secret Key is missing in .env!");
        return res.status(500).json({ success: false, error: "Razorpay Secret Key missing" });
      }
  
      // ✅ Step 3: Generate the Signature
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      console.log("🔹 Generated Signature:", generated_signature);
      console.log("🔹 Received Signature:", razorpay_signature);
  
      // ✅ Step 4: Compare the Generated Signature with the Received Signature
      if (generated_signature === razorpay_signature) {
        console.log("✅ Payment Verification Successful!");
        return res.json({ success: true });
      } else {
        console.error("❌ Invalid Razorpay Signature");
        return res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      console.error("❌ Error verifying Razorpay payment:", error);
      res.status(500).json({ success: false, error: "Failed to verify payment", details: error.message });
    }
  };