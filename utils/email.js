const nodemailer = require('nodemailer');

// Create transporter using Google SMTP with better configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    // Add these options for better reliability
    pool: true,
    maxConnections: 1,
    rateDelta: 1000,
    rateLimit: 5
});

// Verify transporter connection with better error handling
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email transporter error:', error);
        console.error('Please check EMAIL_USER and EMAIL_PASS environment variables');
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

/**
 * Send email to CIL team (Contact Form)
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
 * Send confirmation email to the user (Contact Form)
 */
async function sendUserConfirmation(data) {
    const { fullName, email, subject, message } = data;

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
                        <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
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
            ${message}

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

/**
 * Send newsletter confirmation to subscriber
 */
async function sendNewsletterConfirmation(email) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "You've subscribed to CIL Newsletter",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">Newsletter Subscription Confirmed</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">Thank you for subscribing to the CIL newsletter!</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">You'll receive:</p>
                    <ul style="color: #1E293B; padding-left: 20px;">
                        <li>Latest company news and announcements</li>
                        <li>Investment opportunities across our ecosystem</li>
                        <li>Updates on our 12+ business divisions</li>
                        <li>Exclusive insights and reports</li>
                    </ul>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B; margin-top: 20px;">You can unsubscribe at any time by clicking the link in our emails.</p>
                </div>
                
                <div style="padding: 16px 0; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Collaborative Investment Ltd - Newsletter Subscription Confirmed

            Thank you for subscribing to the CIL newsletter!

            You'll receive:
            - Latest company news and announcements
            - Investment opportunities across our ecosystem
            - Updates on our 12+ business divisions
            - Exclusive insights and reports

            You can unsubscribe at any time by clicking the link in our emails.

            © ${new Date().getFullYear()} Collaborative Investment Ltd.
        `
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Send newsletter notification to admin
 */
async function sendNewsletterNotification(email) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'New Newsletter Subscriber',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">New Newsletter Subscriber</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">A new user has subscribed to the CIL newsletter.</p>
                    
                    <div style="margin: 20px 0; padding: 16px 20px; background: white; border-left: 4px solid #D9A441; border-radius: 8px;">
                        <p style="margin: 0; font-size: 16px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #64748B;"><strong>Subscribed on:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <p style="font-size: 14px; color: #64748B;">You can view all subscribers in the admin panel.</p>
                </div>
                
                <div style="padding: 16px 0; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Collaborative Investment Ltd - New Newsletter Subscriber

            A new user has subscribed to the CIL newsletter.

            Email: ${email}
            Subscribed on: ${new Date().toLocaleString()}

            You can view all subscribers in the admin panel.

            © ${new Date().getFullYear()} Collaborative Investment Ltd.
        `
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Send job application email to HR team
 */
async function sendJobApplication(data) {
    const { fullName, email, phone, country, state, jobTitle, department, coverLetter, cvFilename } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[CIL Careers] Job Application: ${jobTitle} - ${fullName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">New Job Application</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <h3 style="color: #081B33; margin-top: 0;">Application Details</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600; width: 140px;">Position</td>
                            <td style="padding: 8px 12px; background: white;">${jobTitle}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Department</td>
                            <td style="padding: 8px 12px; background: white;">${department}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Full Name</td>
                            <td style="padding: 8px 12px; background: white;">${fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Email</td>
                            <td style="padding: 8px 12px; background: white;"><a href="mailto:${email}" style="color: #D9A441;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Phone</td>
                            <td style="padding: 8px 12px; background: white;">${phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">Country</td>
                            <td style="padding: 8px 12px; background: white;">${country}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">State/Province</td>
                            <td style="padding: 8px 12px; background: white;">${state}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 12px; background: #f1f5f9; font-weight: 600;">CV Attached</td>
                            <td style="padding: 8px 12px; background: white;">${cvFilename}</td>
                        </tr>
                    </table>
                    
                    ${coverLetter ? `
                    <div style="margin-top: 20px; padding: 16px 20px; background: white; border-left: 4px solid #D9A441; border-radius: 8px;">
                        <h4 style="color: #081B33; margin: 0 0 8px;">Cover Letter</h4>
                        <p style="color: #1E293B; margin: 0; line-height: 1.6; white-space: pre-wrap;">${coverLetter}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div style="padding: 16px 0; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
                    <p style="margin: 0;">This application was submitted through the CIL careers portal.</p>
                    <p style="margin: 4px 0 0;">© ${new Date().getFullYear()} Collaborative Investment Ltd. All rights reserved.</p>
                </div>
            </div>
        `,
        text: `
            Collaborative Investment Ltd - New Job Application

            Position: ${jobTitle}
            Department: ${department}
            Applicant: ${fullName}
            Email: ${email}
            Phone: ${phone}
            Country: ${country}
            State/Province: ${state}
            CV: ${cvFilename}
            
            ${coverLetter ? `Cover Letter:\n${coverLetter}` : ''}
            
            ---
            This application was submitted through the CIL careers portal.
            © ${new Date().getFullYear()} Collaborative Investment Ltd.
        `
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Send confirmation email to job applicant
 */
async function sendApplicationConfirmation(data) {
    const { fullName, email, jobTitle, department } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Application Received: ${jobTitle} - Collaborative Investment Ltd`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #D9A441;">
                    <h1 style="color: #081B33; margin: 0;">Collaborative Investment Ltd</h1>
                    <p style="color: #64748B; margin: 4px 0 0;">Application Received</p>
                </div>
                
                <div style="padding: 24px 0;">
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">Dear <strong>${fullName}</strong>,</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">Thank you for applying for the position of <strong>${jobTitle}</strong> at Collaborative Investment Ltd.</p>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #1E293B;">We have received your application and our HR team will review it carefully. If your qualifications match our requirements, we will contact you within 5-7 working days to schedule an interview.</p>
                    
                    <div style="margin: 20px 0; padding: 16px 20px; background: white; border-left: 4px solid #D9A441; border-radius: 8px;">
                        <h4 style="color: #081B33; margin: 0 0 8px;">Application Summary</h4>
                        <p style="color: #475569; margin: 0; line-height: 1.6;">
                            <strong>Position:</strong> ${jobTitle}<br />
                            <strong>Department:</strong> ${department}
                        </p>
                    </div>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #1E293B; margin-top: 20px;">We wish you the best of luck with your application!</p>
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
            Collaborative Investment Ltd - Application Received

            Dear ${fullName},

            Thank you for applying for the position of ${jobTitle} at Collaborative Investment Ltd.

            We have received your application and our HR team will review it carefully. If your qualifications match our requirements, we will contact you within 5-7 working days to schedule an interview.

            Application Summary:
            Position: ${jobTitle}
            Department: ${department}

            We wish you the best of luck with your application!

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

// Export all functions
module.exports = {
    sendContactEmail,
    sendUserConfirmation,
    sendNewsletterConfirmation,
    sendNewsletterNotification,
    sendJobApplication,
    sendApplicationConfirmation
};