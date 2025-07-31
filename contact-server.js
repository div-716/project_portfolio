const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:8080', 'https://div-716.github.io', 'https://your-portfolio-domain.com'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many contact form submissions, please try again later.'
});

app.use('/contact', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'sdivyanshi573@gmail.com',
        pass: process.env.EMAIL_PASS // This should be an app password, not your regular password
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'sdivyanshi573@gmail.com',
            subject: `Portfolio Contact: Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #990000;">New Contact Form Submission</h2>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                        <h3>Contact Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                        
                        <h3>Message:</h3>
                        <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #990000;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This message was sent from your portfolio contact form.
                    </p>
                </div>
            `,
            text: `
                New Contact Form Submission
                
                Name: ${name}
                Email: ${email}
                Time: ${new Date().toLocaleString()}
                
                Message:
                ${message}
                
                ---
                This message was sent from your portfolio contact form.
            `
        };

        // Send confirmation email to the sender
        const confirmationOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Divyanshi Shekhawat',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #990000;">Thank You for Your Message!</h2>
                    <p>Dear ${name},</p>
                    
                    <p>Thank you for reaching out through my portfolio. I have received your message and will get back to you as soon as possible.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>Your Message:</h3>
                        <p style="font-style: italic;">"${message}"</p>
                    </div>
                    
                    <p>In the meantime, feel free to:</p>
                    <ul>
                        <li>Connect with me on <a href="https://www.linkedin.com/in/sdivyanshi573" style="color: #990000;">LinkedIn</a></li>
                        <li>Check out my projects on <a href="https://github.com/div-716" style="color: #990000;">GitHub</a></li>
                        <li>Read my technical articles on <a href="https://medium.com/@sdivyanshi573" style="color: #990000;">Medium</a></li>
                    </ul>
                    
                    <p>Best regards,<br>
                    <strong>Divyanshi Shekhawat</strong><br>
                    Engineering Student & DevOps Enthusiast</p>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated response from divyanshi's portfolio website.
                    </p>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(confirmationOptions);

        console.log(`Contact form submission from ${name} (${email}) at ${new Date().toISOString()}`);

        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully! You will receive a confirmation email shortly.' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later or contact directly via email.' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Contact server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
