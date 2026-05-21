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
        from: `"Black Energie Store" <${process.env.SMTP_USER}>`,
        to: 'hamza.emilie23@gmail.com',
        subject: `New Contact Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #c9a050; text-align: center;">Contact Form Message</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 10px;">
                    ${message}
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendContactEmail };
