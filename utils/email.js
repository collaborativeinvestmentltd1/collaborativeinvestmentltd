const nodemailer = require('nodemailer');

// Create transporter using Google SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

/**
 * Send email to CIL team
 */
async function sendContactEmail(data) {
    const { fullName, email, phone, subject, message } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `[CIL Contact] ${subject} - from ${fullName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">New Contact Form Submission</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <h3 style="color: #081B33; margin-top: 0;">Contact Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600; width: 120px;">Name</td>
                            <td style="padding: 8px 12px; background: white;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Email</td>
                            <td style="padding: 8px 12px; background: white;"><a href="mailto:${email}" style="color: #D9A441;">${email}</a></td>
                        </tr>
                        ${phone ? `
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Phone</td>
                            <td style="padding: 8px 12px; background: white;">${phone}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Subject</td>
                            <td style="padding: 8px 12px; background: white;">${subject}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 16px 20px; background: white; border-left: 4px solid #D9A441; border-radius: 8px;">
                        <h4 style="color: #081B33; margin: 0 0 8px;">Message</h4>
                        <p style="color: #1E293B; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
                
                <div style="padding: 16px 0; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
                    <p style="margin: 0;">This message was sent from the CIL website contact form.</p>
                    <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Collaborative Investment Ltd - New Contact Form Submission
            
            Name: ${fullName}
            Email: ${email}
            ${phone ? `Phone: ${phone}` : ''}
            Subject: ${subject}
            
            Message:
            ${message}
            
            ---
            This message was sent from the CIL website contact form.
            © ${new Date().getFullYear()} Collaborative Investment Ltd.
        `
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Send confirmation email to the user
 */
async function sendUserConfirmation(data) {
    const { fullName, email, subject } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting Collaborative Investment Ltd`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">We've received your message</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">Dear <strong>${fullName}</strong>,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">Thank you for reaching out to Collaborative Investment Ltd. We have received your inquiry regarding <strong>${subject}</strong> and will get back to you within 24 hours.</p>
                    
                    <div style="margin: 20px 0; padding: 16px 20px; background: white; border-left: 4px solid #D9A441; border-radius: 8px;">
                        <h4 style="color: #081B33; margin: 0 0 8px;">Your Message Summary</h4>
                        <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
                    </div>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #1E293B; margin-top: 20px;">In the meantime, feel free to explore our ecosystem:</p>
                    <ul style="color: #1E293B; padding-left: 20px;">
                        <li><a href="https://collaborativeinvestmentltd.com/property" style="color: #D9A441;">Property Management</a></li>
                        <li><a href="https://collaborativeinvestmentltd.com/solar" style="color: #D9A441;">Solar Energy Solutions</a></li>
                        <li><a href="https://collaborativeinvestmentltd.com/finance" style="color: #D9A441;">Financial Services</a></li>
                        <li><a href="https://collaborativeinvestmentltd.com/workforce" style="color: #D9A441;">Workforce Development</a></li>
                    </ul>
                </div>
                
                <div style="padding: 16px 0; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
                    <p style="margin: 0;">Collaborative Investment Ltd</p>
                    <p style="margin: 4px 0 0;">212 Ijegun Road, Ikotun, Lagos, Nigeria</p>
                    <p style="margin: 4px 0 0;"><a href="tel:+2347078269765" style="color: #D9A441;">+234 707 826 9765</a> | <a href="mailto:collaborativeinvestmentltd@gmail.com" style="color: #D9A441;">collaborativeinvestmentltd@gmail.com</a></p>
                    <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Collaborative Investment Ltd - We've received your message
            
            Dear ${fullName},
            
            Thank you for reaching out to Collaborative Investment Ltd. We have received your inquiry regarding ${subject} and will get back to you within 24 hours.
            
            Your Message Summary:
            ${data.message}
            
            In the meantime, feel free to explore our ecosystem:
            - Property Management: https://collaborativeinvestmentltd.com/property
            - Solar Energy Solutions: https://collaborativeinvestmentltd.com/solar
            - Financial Services: https://collaborativeinvestmentltd.com/finance
            - Workforce Development: https://collaborativeinvestmentltd.com/workforce
            
            ---
            Collaborative Investment Ltd
            212 Ijegun Road, Ikotun, Lagos, Nigeria
            +234 707 826 9765
            collaborativeinvestmentltd@gmail.com
            © ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendContactEmail,
    sendUserConfirmation
};