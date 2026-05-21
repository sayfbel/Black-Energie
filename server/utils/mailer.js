const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"Black Energie Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Admin Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #c9a050; text-align: center;">Verification Code</h2>
                <p>Hello Admin,</p>
                <p>You are attempting to log in to the Black Energie Admin Dashboard. Please use the following 6-digit code to complete your verification:</p>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

const sendContactEmail = async (contactData) => {
    const { name, email, message } = contactData;
    const mailOptions = {
        from: `"Black Energie Concierge" <${process.env.SMTP_USER}>`,
        to: 'hamza.emilie23@gmail.com',
        subject: `[CONCIERGE] New Message from ${name}`,
        html: `
            <div style="background-color: #0a0a0a; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
                <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #1a1a1a;">
                    <h1 style="color: #c9a050; font-size: 24px; letter-spacing: 5px; text-transform: uppercase; margin: 0; font-weight: 300;">Black Energie</h1>
                    <p style="color: rgba(255,255,255,0.4); font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px;">Artisanal Maison Concierge</p>
                </div>
                
                <div style="padding: 50px 40px;">
                    <h2 style="color: #ffffff; font-size: 18px; font-weight: 400; margin-bottom: 30px; border-left: 3px solid #c9a050; padding-left: 15px;">New Inquiry Received</h2>
                    
                    <div style="margin-bottom: 25px;">
                        <span style="color: #c9a050; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px;">Client Name</span>
                        <span style="font-size: 15px; color: #ffffff;">${name}</span>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <span style="color: #c9a050; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 5px;">Return Address</span>
                        <a href="mailto:${email}" style="font-size: 15px; color: #ffffff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2);">${email}</a>
                    </div>
                    
                    <div style="margin-top: 40px; padding: 30px; background-color: #111111; border: 1px solid #1a1a1a; border-radius: 2px;">
                        <span style="color: #c9a050; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 15px;">Message Content</span>
                        <p style="color: rgba(255,255,255,0.8); line-height: 1.8; font-size: 14px; margin: 0;">
                            ${message}
                        </p>
                    </div>
                </div>
                
                <div style="padding: 30px; text-align: center; background-color: #0d0d0d; border-top: 1px solid #1a1a1a;">
                    <p style="color: rgba(255,255,255,0.2); font-size: 9px; letter-spacing: 2px; margin: 0;">&copy; 2026 BLACK ENERGIE RESERVES. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendContactEmail };
