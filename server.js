require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    TOKEN
} = process.env;

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // set true if SMTP_PORT is 465
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

/**
 * POST /send-email
 * Expects JSON body: { to, subject, text, html }
 * Requires Authorization header with token
 * If both text and html are specified, html will be used
 */
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;
        const authHeader = req.headers.authorization;
        
        // Check if authorization header exists and has correct format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header missing or invalid format' });
        }

        // Extract token (remove "Bearer " prefix)
        const token = authHeader.substring(7);
        
        // Check if provided token matches the .env token
        if (token !== TOKEN) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Prepare email options
        const mailOptions = {
            from: SMTP_USER, // Sender address
            to,              // List of receivers
            subject,         // Subject line
        };

        // Add email content - prefer html if both are specified
        if (html) {
            mailOptions.html = html;
        } else if (text) {
            mailOptions.text = text;
        } else {
            return res.status(400).json({ error: 'Either text or html content is required' });
        }

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
    }
});

// Start the server
const PORT = 3881;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
