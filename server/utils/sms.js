// Twilio SMS helper. Agar .env me TWILIO_* set nahi hai, to sirf console.log
// karega (dev fallback) — production me jaane se pehle Twilio account banake
// yeh 3 env vars zaroor fill karo: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendOtpSms(phone, otp) {
    const message = `Your Chalo verification code is ${otp}. Valid for 10 minutes.`;

    if (!client) {
        console.log(`📩 [DEV MODE — no Twilio configured] OTP for ${phone}: ${otp}`);
        return { simulated: true };
    }

    try {
        const res = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${phone}`, // India country code — adjust if supporting other countries
        });
        return { simulated: false, sid: res.sid };
    } catch (err) {
        console.error('❌ Twilio SMS failed:', err.message);
        // SMS fail hone par bhi flow todna nahi hai — OTP DB me save hai, log me dikh jayega
        console.log(`📩 [Fallback log] OTP for ${phone}: ${otp}`);
        return { simulated: true, error: err.message };
    }
}

module.exports = { sendOtpSms };